# vite-plugin-optimize-persist

[![NPM version](https://img.shields.io/npm/v/vite-plugin-optimize-persist?color=a1b858&label=)](https://www.npmjs.com/package/vite-plugin-optimize-persist)

Persist dynamically analyzed dependencies optimization

## Motivation

Vite's dependencies pre-optimization is cool and can improve the DX a lot. While Vite can smartly detect dynamic dependencies, it's on-demanded natural sometimes make the booting up for complex project quite slow.

```bash
[vite] new dependencies found: @material-ui/icons/Dehaze, @material-ui/core/Box, @material-ui/core/Checkbox, updating...
[vite] ✨ dependencies updated, reloading page...
[vite] new dependencies found: @material-ui/core/Dialog, @material-ui/core/DialogActions, updating...
[vite] ✨ dependencies updated, reloading page...
[vite] new dependencies found: @material-ui/core/Accordion, @material-ui/core/AccordionSummary, updating...
[vite] ✨ dependencies updated, reloading page...
```

As you might know, you can explicitly set the dependencies in `optimizeDeps.include` so they will be optimized once at the server start up for the first time. When you project become more complex, this could be somehow a bit laborious.

With `vite-plugin-optimize-persist`, it will persist the names of the dynamic dependencies in your `package.json` so you and your team does not need to be bother by them for the next time.

```jsonc
// package.json
{
  // ...
  "vite": {
    "optimizeDeps": {
      "include": [
        // managed by `vite-plugin-optimize-persist`
        "@material-ui/core/Accordion",
        "@material-ui/core/AccordionSummary",
        "@material-ui/core/Dialog",
        "@material-ui/core/DialogActions",
        "@material-ui/icons/Dehaze",
        "date-fns/format",
        "lodash/debounce",
        "lodash/map"
      ]
    }
  }
}
```

## Install

```bash
npm i -D vite-plugin-optimize-persist vite-plugin-package-config
```

Add plugin to your `vite.config.ts`:

```ts
// vite.config.ts
import OptimizationPersist from 'vite-plugin-optimize-persist'
import PkgConfig from 'vite-plugin-package-config'

export default {
  plugins: [
    PkgConfig(),
    OptimizationPersist()
  ]
}
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2021 [Anthony Fu](https://github.com/antfu)
