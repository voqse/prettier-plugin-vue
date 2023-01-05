# prettier-plugin-vue

[![CI](https://img.shields.io/github/actions/workflow/status/voqse/prettier-plugin-vue/deploy.yml?branch=master)](https://github.com/voqse/prettier-plugin-vue/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/prettier-plugin-vue)](https://www.npmjs.com/package/prettier-plugin-vue)

A [Prettier](https://prettier.io/) plugin that extends default Vue files formatting with additional options.

## Installation
To get started, just install prettier-plugin-vue as a dev-dependency:
```shell
npm install prettier prettier-plugin-vue --save-dev
```

This plugin follows Prettier’s autoloading convention, so as long as you’ve got Prettier set up in your project, it’ll start working automatically as soon as it’s installed.

Note that plugin autoloading is not supported when using certain package managers, such as pnpm or Yarn PnP. In this case you may need to add the plugin to your Prettier config explicitly:

```javascript
// prettier.config.js
module.exports = {
  plugins: [require('prettier-plugin-vue')],
}
```

## Configuration
### vueExcludeBlocks
An array of block names that Prettier will skip while formatting Vue SFC files.
> By default, this plugin ignores `<style>` blocks to avoid interfering with other linters.

| Default     | CLI Override                    | API Override                 |
|-------------|---------------------------------|------------------------------|
| `['style']` | `--vue-exclude-blocks <string>` | `vueExcludeBlocks: <string>` |

### Example `.prettierrc`
```javascript
{
  vueExcludeBlocks: ["style", "template"]
}
```
