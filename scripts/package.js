/* eslint-disable */
//const version = require('../../../lerna.json').version
const fs = require('fs')
const pkg = require('../extension/package.json')
const { exec } = require('child_process')

async function main() {
  if (fs.existsSync('./extension/editor')) {
    fs.rmSync('./extension/editor', { recursive: true }, (e) => {
      if (e) {
        throw e
      }
    })
  }
  if (fs.existsSync('./out')) {
    fs.rmSync('./out', { recursive: true }, (e) => {
      if (e) {
        throw e
      }
    })
  }

  fs.mkdirSync('./out')

  try {
    exec(
      `cp -r ./editor/dist extension/editor; cd extension; vsce package; mv ${pkg.name}-${pkg.version}.vsix ${'../out'}`,
      (error, stdout, stderr) => {
        if (error) {
          throw new Error(error.message)
        }
        if (stderr && stderr.search('warning') !== 0) {
          throw new Error(stderr)
        }
      }
    )
  } catch (e) {
    console.log(`× ${pkg.name}: Build failed due to an error.`)
    console.log(e)
  }
}

main()