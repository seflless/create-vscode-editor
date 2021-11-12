/* eslint-disable */
import fs from 'fs'

import esbuild from 'esbuild'
import { gzip } from 'zlib'

import { createRequire } from 'module'
const pkg = createRequire(import.meta.url)('../package.json')

async function main() {
  if (fs.existsSync('./extension/dist')) {
    fs.rmSync('./extension/dist', { recursive: true }, (e) => {
      if (e) {
        throw e
      }
    })
  }

  try {
    const esmResult = esbuild.buildSync({
      entryPoints: ['./extension/src/extension.ts'],
      outdir: 'extension/dist/web',
      minify: true,
      bundle: true,
      format: 'cjs',
      target: 'es6',
      define: {
        'process.env.NODE_ENV': '"development"',
      },
      tsconfig: '../extension/tsconfig.json',
      external: Object.keys(pkg.dependencies)
        .concat(Object.keys(pkg.devDependencies))
        .concat(['vscode'])
        ,
      metafile: true,
    })

    let esmSize = 0
    Object.values(esmResult.metafile.outputs).forEach((output) => {
      esmSize += output.bytes
    })

    fs.readFile('./extension/dist/web/index.js', (_err, data) => {
      gzip(data, (_err, result) => {
        console.log(
          `✔ ${pkg.name}: Built pkg. ${(esmSize / 1000).toFixed(2)}kb (${(
            result.length / 1000
          ).toFixed(2)}kb minified)`
        )
      })
    })
  } catch (e) {
    console.log(`× ${"pkg.name"}: Build failed due to an error.`)
    console.log(e)
  }
}

main()
