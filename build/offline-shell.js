const { createHash } = require('node:crypto')
const { readFileSync } = require('node:fs')
const path = require('node:path')

class OfflineShellPlugin {
  apply(compiler) {
    const { Compilation, sources } = compiler.webpack
    compiler.hooks.thisCompilation.tap('OfflineShellPlugin', compilation => {
      compilation.hooks.processAssets.tap(
        { name: 'OfflineShellPlugin', stage: Compilation.PROCESS_ASSETS_STAGE_REPORT },
        () => {
          const assets = compilation
            .getAssets()
            .filter(
              ({ name }) =>
                name === 'index.html' ||
                name === 'favicon.ico' ||
                name === 'manifest.webmanifest' ||
                /^logo-\d+\.png$/.test(name) ||
                name.startsWith('products/') ||
                (name.startsWith('static/') && !name.endsWith('.map'))
            )
          const worker = readFileSync(path.join(__dirname, 'service-worker.js'), 'utf8')
          const version = createHash('sha256')
          version.update(worker)
          for (const { name, source } of assets) {
            version.update(name)
            version.update(source.source())
          }
          const config = {
            version: version.digest('hex').slice(0, 16),
            assets: assets.map(asset => asset.name)
          }
          compilation.emitAsset('sw.js', new sources.RawSource(`const shell = ${JSON.stringify(config)}\n${worker}`))
        }
      )
    })
  }
}

module.exports = OfflineShellPlugin
