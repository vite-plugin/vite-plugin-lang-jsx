# vite-plugin-lang-jsx

Automatically add `lang="jsx"` to `<script>` tag when using `vite-plugin-vue2`

[![npm package](https://nodei.co/npm/vite-plugin-lang-jsx.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/vite-plugin-lang-jsx)
[![NPM version](https://img.shields.io/npm/v/vite-plugin-lang-jsx.svg?style=flat)](https://npmjs.org/package/vite-plugin-lang-jsx)
[![NPM Downloads](https://img.shields.io/npm/dm/vite-plugin-lang-jsx.svg?style=flat)](https://npmjs.org/package/vite-plugin-lang-jsx)

English | [简体中文](https://github.com/vite-plugin/vite-plugin-lang-jsx/README.zh-CN.md)

✅ Support write `jsx` in `.vue` files  
✅ Support write `jsx` in `.js` files  

## Install

```sh
npm i vite-plugin-lang-jsx -D
```

## Usage

🚧 The plugin should be placed before `vite-plugin-vue2`

```js
import langJsx from 'vite-plugin-lang-jsx'
import { createVuePlugin } from 'vite-plugin-vue2'

export default {
  plugins: [
    langJsx(),
    createVuePlugin(),
  ]
}
```

## How to work

```html
// source code
<script>
  export default {
    render() {
      return <div>Hello world!</div>;
    },
  }
</script>

// transformed
<script lang="jsx">
  export default {
    render() {
      return <div>Hello world!</div>;
    },
  }
</script>
```

## Why

When we upgrade the Vue2.x proejct created by `@vue/cli` to Vite, we will use `vue-plugin-vue2`.

1. However, `vue-plugin-vue2` does not automatically handle the `jsx` syntax in `<script>`. So we need to add `lang=jsx` above `<script>` to ensure its worked.

2. Secondly, the plugin allows you to write `jsx` syntax in the `.js` file.  
