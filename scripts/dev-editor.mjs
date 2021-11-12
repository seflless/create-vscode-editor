/* eslint-disable no-undef */
import fs from 'fs'
import esbuildServe from 'esbuild-serve'

async function main() {
  if (!fs.existsSync('./editor/dist')) {
    fs.mkdirSync('./editor/dist')
  }

  try {
    await esbuildServe(
      {
        entryPoints: ['editor/src/index.tsx'],
        outfile: 'editor/dist/index.js',
        minify: false,
        bundle: true,
        incremental: true,
        target: 'es6',
        define: {
          'process.env.NODE_ENV': '"production"',
        },
        watch: {
          onRebuild(err) {
            err ? error('❌ Failed') : log('✅ Updated')
          },
        },
      },
      {
        port: 5420,
        root: './editor/dist',
        live: true,
      }
    )
  } catch (err) {
    process.exit(1)
  }
}

main()
