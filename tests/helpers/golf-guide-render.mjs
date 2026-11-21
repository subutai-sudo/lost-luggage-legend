import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { resolve, dirname } from 'node:path'
import ts from 'typescript'
import { publishedBytes } from './trip-planning-approval.mjs'
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
async function moduleUrl(path, sourceOverride) {
  const key = sourceOverride === undefined ? path : `${path}\0${sourceOverride}`
  if (cache.has(key)) return cache.get(key)
  let source = sourceOverride ?? await readFile(path, 'utf8')
  if (path.endsWith('.json')) return inline(`export default ${source}`)
  source = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } }).outputText
  const imports = [...source.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)].map(m => m[1])
  for (const name of new Set(imports)) {
    let url
    if (Object.hasOwn(stubs, name)) url = inline(stubs[name])
    else if (name.endsWith('.css')) url = inline('export default new Proxy({}, {get: (_, key) => key})')
    else {
      const target = name.startsWith('@/') ? resolve(root, 'src', name.slice(2)) : resolve(dirname(path), name)
      if (/\.(ts|tsx|json)$/.test(target)) url = await moduleUrl(target)
      else {
        try { url = await moduleUrl(`${target}.ts`) }
        catch (error) {
          if (error.code !== 'ENOENT' || error.path !== `${target}.ts`) throw error
          url = await moduleUrl(`${target}.tsx`)
        }
      }
    }
    source = source.replaceAll(`'${name}'`, `'${url}'`).replaceAll(`"${name}"`, `"${url}"`)
  }
  const url = inline(source); cache.set(key, url); return url
}
export const page = await import(await moduleUrl(resolve(root, 'src/app/golf/[slug]/page.tsx')))
const articlePath = 'src/app/golf/[slug]/page.tsx'
const publishedPage = await import(await moduleUrl(resolve(root, articlePath), publishedBytes(articlePath, await readFile(resolve(root, articlePath))).toString()))
const { GolfEmblem } = await import(await moduleUrl(resolve(root, 'src/components/GolfEmblem.tsx')))
export const guides = (await import(await moduleUrl(resolve(root, 'src/lib/golfGuides.ts')))).getGolfGuides()
export function nodes(tree) {
  if (!tree || typeof tree !== 'object') return []
  if (Array.isArray(tree)) return tree.flatMap(nodes)
  return [tree, ...nodes(tree.props?.children)]
}
export const text = node => node == null || node === false ? '' : Array.isArray(node) ? node.map(text).join(' ') : typeof node === 'object' ? text(node.props?.children) : String(node)
export const render = id => page.default({ params: Promise.resolve({slug: id}) })
export const renderPublished = id => publishedPage.default({ params: Promise.resolve({slug: id}) })
export const metadata = id => page.generateMetadata({ params: Promise.resolve({slug: id}) })

// This clone removes exactly the authorized ornament and root edition marker.
// Main/article/source/photo/metadata oracles above remain completely untouched.
export function normalizeGolfPresentation(tree) {
  assert.equal(tree.props['data-design-edition'], 'golf')
  const all = nodes(tree)
  assert.equal(all.filter(n => Object.hasOwn(n.props ?? {}, 'data-design-edition')).length, 1)
  const imprints = all.filter(n => Object.hasOwn(n.props ?? {}, 'data-golf-edition'))
  assert.equal(imprints.length, 1)
  const imprint = imprints[0]
  assert.deepEqual(imprint, { type: 'div', props: {
    className: 'clubhouseImprint', 'data-golf-edition': true, 'aria-hidden': 'true', children: [
      { type: GolfEmblem, props: { className: 'golfEmblem' } },
      { type: 'span', props: { className: 'editionLabel', children: 'The golf edition' } },
      { type: 'span', props: { className: 'editionDetail', children: 'Seasonal course field notes' } },
    ],
  } })
  const parent = all.filter(n => Array.isArray(n.props?.children) && n.props.children.includes(imprint))
  assert.equal(parent.length, 1)
  assert.equal(parent[0].props.className, 'heroInner')
  const clone = value => {
    if (Array.isArray(value)) return value.filter(child => child !== imprint).map(clone)
    if (!value || typeof value !== 'object') return value
    const copy = { ...value, props: { ...value.props } }
    if (value === tree) delete copy.props['data-design-edition']
    if (Object.hasOwn(copy.props, 'children')) copy.props.children = clone(copy.props.children)
    return copy
  }
  return clone(tree)
}
