import fs from 'fs-extra'
import _debug from 'debug'
import type { Plugin } from 'vite'
import type { Options as PkgConfigOptions } from 'vite-plugin-package-config'

const debug = _debug('vite-plugin-optimize-persist')

export interface Options {
  /**
   * Milliseconds to wait before writing the package.json file.
   *
   * @default 10000
   */
  delay?: number
}

function VitePluginPackageConfig(options: Options = {}): Plugin {
  const delay = options.delay || 10000

  return <Plugin> {
    name: 'hi',
    apply: 'serve',
    configureServer(server) {
      const pkgConfig: Required<PkgConfigOptions> = (server.config.plugins as any).find((i: any) => i.name === 'vite-plugin-package-config')?.api.options

      if (!pkgConfig)
        throw new Error('[vite-config-optimize-persist] plugin "vite-plugin-package-config" not found, have you installed it ?')

      // @ts-expect-error
      let optimizeDepsMetadata: any = server._ssrExternals
      const forceIncluded = server.config?.optimizeDeps?.include || []
      let newDeps: string[] = []
      let timer: any

      function update() {
        newDeps = Object.keys(
          optimizeDepsMetadata?.optimized || {},
        ).filter(i => !forceIncluded.includes(i))
        debug('newDeps', newDeps)

        clearTimeout(timer)
        if (newDeps.length)
          timer = setTimeout(write, delay)
      }

      async function write() {
        debug(`writting to ${pkgConfig.packageJsonPath}`)
        const pkg = await fs.readJSON(pkgConfig.packageJsonPath)
        pkg[pkgConfig.field] = pkg[pkgConfig.field] || {}
        const extend = pkg[pkgConfig.field]
        extend.optimizeDeps = extend.optimizeDeps || {}
        extend.optimizeDeps.include = Array.from(new Set([
          ...(extend.optimizeDeps.include || []),
          ...newDeps,
        ]))
        extend.optimizeDeps.include.sort()
        await fs.writeJSON(pkgConfig.packageJsonPath, pkg, { spaces: 2 })
      }

      Object.defineProperty(server, '_optimizeDepsMetadata', {
        get() {
          return optimizeDepsMetadata
        },
        set(v) {
          optimizeDepsMetadata = v
          update()
        },
      })
    },
  }
}

export default VitePluginPackageConfig
