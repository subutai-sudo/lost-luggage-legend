import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import ts from 'typescript'
const root = new URL('../../', import.meta.url).pathname
const inline = code => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
const stubs = {
  'server-only': '',
  'react/jsx-runtime': 'export const jsx = (type, props) => ({type, props}); export const jsxs = jsx;',
  'next/image': 'export default "Image"', 'next/link': 'export default "Link"',
  'next/navigation': 'export const notFound = () => { throw new Error("404") }',
  '@/components/BrandLogo': 'export const BrandLogo = "BrandLogo"',
  '@/components/Navbar': 'export const Navbar = "Navbar"',
  '@/components/GolfCourseMedia': 'export const GolfCourseMedia = "GolfCourseMedia"',
}
const cache = new Map()
async function moduleUrl(path) {
  if (cache.has(path)) return cache.get(path)
  let source = await readFile(path, 'utf8')
  if (path.endsWith('.json')) return inline(`export default ${source}`)
  source = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } }).outputText
  const imports = [...source.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)].map(m => m[1])
  for (const name of new Set(imports)) {
    let url
    if (Object.hasOwn(stubs, name)) url = inline(stubs[name])
    else if (name.endsWith('.css')) url = inline('export default new Proxy({}, {get: (_, key) => key})')
    else {
      const target = name.startsWith('@/') ? resolve(root, 'src', name.slice(2)) : resolve(dirname(path), name)
      url = await moduleUrl(/\.(ts|tsx|json)$/.test(target) ? target : `${target}.ts`)
    }
    source = source.replaceAll(`'${name}'`, `'${url}'`).replaceAll(`"${name}"`, `"${url}"`)
  }
  const url = inline(source); cache.set(path, url); return url
}
export const page = await import(await moduleUrl(resolve(root, 'src/app/golf/[slug]/page.tsx')))
export const guides = (await import(await moduleUrl(resolve(root, 'src/lib/golfGuides.ts')))).getGolfGuides()
export function nodes(tree) {
  if (!tree || typeof tree !== 'object') return []
  if (Array.isArray(tree)) return tree.flatMap(nodes)
  return [tree, ...nodes(tree.props?.children)]
}
export const text = node => node == null || node === false ? '' : Array.isArray(node) ? node.map(text).join(' ') : typeof node === 'object' ? text(node.props?.children) : String(node)
export const render = id => page.default({ params: Promise.resolve({slug: id}) })
export const metadata = id => page.generateMetadata({ params: Promise.resolve({slug: id}) })
