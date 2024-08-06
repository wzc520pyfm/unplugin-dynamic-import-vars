# unplugin-dynamic-import-vars

[![NPM version](https://img.shields.io/npm/v/unplugin-dynamic-import-vars?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-dynamic-import-vars)

🍣 A universal bundler plugin to support variables in dynamic imports in Bundler.

## Install

```bash
npm i unplugin-dynamic-import-vars
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import UnpluginDynamicImportVars from 'unplugin-dynamic-import-vars/vite'

export default defineConfig({
  plugins: [
    UnpluginDynamicImportVars({
      /* options */
    }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import UnpluginDynamicImportVars from 'unplugin-dynamic-import-vars/rollup'

export default {
  plugins: [
    UnpluginDynamicImportVars({
      /* options */
    }),
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-dynamic-import-vars/webpack')({
      /* options */
    }),
  ],
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    [
      'unplugin-dynamic-import-vars/nuxt',
      {
        /* options */
      },
    ],
  ],
})
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-dynamic-import-vars/webpack')({
        /* options */
      }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import UnpluginDynamicImportVars from 'unplugin-dynamic-import-vars/esbuild'

build({
  plugins: [UnpluginDynamicImportVars()],
})
```

<br></details>

## Usage

### Options

For all options please refer to [docs](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options).

This plugin accepts all [@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options) options.
