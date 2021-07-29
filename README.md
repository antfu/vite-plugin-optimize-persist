# vite-plugin-optimize-persist

[![NPM version](https://img.shields.io/npm/v/vite-plugin-optimize-persist?color=a1b858&label=)](https://www.npmjs.com/package/vite-plugin-optimize-persist)

Persist dynamically analyzed deps optimization

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
