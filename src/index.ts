import fs from 'fs-extra'
import _debug from 'debug'
import type { Plugin } from 'vite'
import type { VitePluginPackageConfigPlugin } from 'vite-plugin-package-config'
import { isPackageExists } from 'local-pkg'

const debug = _debug('vite-plugin-optimize-persist')

export interface Options {
  /**
   * Milliseconds to wait before writing the package.json file.
   *
   * @default 1000
   */
  delay?: number

  /**
   * Filter predictor for modules to include
   *
   * @default truthy predictor
   */
  filter?: (includeModule: string) => boolean
}

function VitePluginOptimizePersist({ delay = 1000, filter = () => true }: Options = {}): Plugin {
  return {
    name: 'vite-plugin-optimize-persist',
    apply: 'serve',
    configureServer(server) {
      const vitePluginPackageConfigPlugin = server.config.plugins.find(plugin => plugin.name === 'vite-plugin-package-config') as VitePluginPackageConfigPlugin | undefined
      const pkgConfig = vitePluginPackageConfigPlugin?.api.options

      if (!pkgConfig)
        throw new Error('[vite-config-optimize-persist] plugin "vite-plugin-package-config" not found, have you installed it ?')

      const { packageJsonPath, field } = pkgConfig

      // @ts-expect-error
      let optimizeDepsMetadata: { optimized: Record<string, string> } | undefined = server._ssrExternals

      let shouldReset = false

      if (server.config?.optimizeDeps?.include) {
        server.config.optimizeDeps.include = server.config.optimizeDeps.include.filter((pkg) => {
          const exists = isPackageExists(pkg)
          if (!exists)
            shouldReset = true
          return exists
        })
      }

      const forceIncluded = server.config?.optimizeDeps?.include || []

      let newDeps: string[] = []
      let timer: NodeJS.Timeout

      function update() {
        newDeps = Object.keys(
          optimizeDepsMetadata?.optimized || {},
        )
          .filter(dep => !forceIncluded.includes(dep))
          .filter(filter)
        debug('newDeps', newDeps)

        clearTimeout(timer)
        timer = setTimeout(write, delay)
      }

      async function write() {
        if (!newDeps.length && !shouldReset)
          return

        debug(`writting to ${packageJsonPath}`)
        const pkg = await fs.readJSON(packageJsonPath)
        pkg[field] = pkg[field] || {}
        const extend = pkg[field]
        extend.optimizeDeps = extend.optimizeDeps || {}

        if (shouldReset)
          extend.optimizeDeps.include = forceIncluded

        extend.optimizeDeps.include = Array.from(new Set([
          ...(extend.optimizeDeps.include || []),
          ...newDeps,
        ]))
        extend.optimizeDeps.include.sort()
        server.watcher.unwatch(packageJsonPath)
        await fs.writeJSON(packageJsonPath, pkg, { spaces: 2 })
        server.watcher.add(packageJsonPath)
        debug('written')
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

export default VitePluginOptimizePersist
