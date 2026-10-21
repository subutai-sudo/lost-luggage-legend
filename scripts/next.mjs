import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const env = { ...process.env }

// Node reads extra roots only at process startup. Loading this in .env.local
// would be too late. Keep the correction local to Next, not the machine.
// On this Mac Homebrew Node 25 fails the Unsplash chain while Node 22 succeeds;
// the OS-provided trust bundle verifies it with both runtimes.
if (env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
  console.error('Refusing to start Next with TLS certificate verification disabled.')
  process.exit(1)
}
if (process.platform === 'darwin' && !env.NODE_EXTRA_CA_CERTS && existsSync('/etc/ssl/cert.pem')) {
  env.NODE_EXTRA_CA_CERTS = '/etc/ssl/cert.pem'
}

const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), ...process.argv.slice(2)], {
  cwd: fileURLToPath(new URL('..', import.meta.url)),
  env,
  stdio: 'inherit',
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal))
}
child.on('error', error => {
  console.error(`Cannot start Next: ${error.message}`)
  process.exitCode = 1
})
child.on('exit', (code, signal) => {
  if (signal) {
    process.removeAllListeners(signal)
    process.kill(process.pid, signal)
  } else process.exitCode = code ?? 1
})
