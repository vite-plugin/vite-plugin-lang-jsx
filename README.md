# vite-plugin-lang-jsx

Support write jsx in js files

[![npm package](https://nodei.co/npm/vite-plugin-lang-jsx.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/vite-plugin-lang-jsx)
[![NPM version](https://img.shields.io/npm/v/vite-plugin-lang-jsx.svg)](https://npmjs.org/package/vite-plugin-lang-jsx)
[![NPM Downloads](https://img.shields.io/npm/dm/vite-plugin-lang-jsx.svg)](https://npmjs.org/package/vite-plugin-lang-jsx)

English | [简体中文](https://github.com/vite-plugin/vite-plugin-lang-jsx/blob/main/README.zh-CN.md)

✅ Support write `jsx` in `.vue` files  
✅ Compatible `create-react-app`  

## Install

```sh
npm i vite-plugin-lang-jsx -D
```

## Usage

#### Vue2 Project

Automatically add `lang="jsx"` to `<script>` tag when using `vite-plugin-vue2`

🚧 The plugin should be placed before `vite-plugin-vue2`

```js
import langJsx from 'vite-plugin-lang-jsx'
import { createVuePlugin } from 'vite-plugin-vue2'

export default {
  plugins: [
    langJsx(/* options */),
    createVuePlugin(),
  ]
}
```

#### create-react-app

```js
import langJsx from 'vite-plugin-lang-jsx'

export default {
  plugins: [
    langJsx(),
    // ...other plugins
  ]
}
```

## API <sub><sup>(Define)</sup></sub>

```ts
export interface LangJsx {
  (options?: {
    filter?: (id: string) => boolean | void;
    /**
     * Check JSX with ast, and use RegExp by default.
     */
    useAst?: boolean;
  }): Plugin[];
}
```

## How to work

`.vue` files

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

`.js` files

```js
// source code
import JsxComponent from './jsx-component'

// add `lang.jsx` suffix
import JsxComponent from './jsx-component?lang.jsx'

```

## Why

While we upgrade the Vue2.x proejct created by `@vue/cli` to Vite, we will use `vue-plugin-vue2`.

1. However, `vue-plugin-vue2` does not automatically handle the `jsx` syntax in `<script>`. So we need to add `lang=jsx` above `<script>` to ensure its worked.

2. Secondly, the plugin allows you to write `jsx` syntax in the `.js` file.  

Many times many prople like to write `jsx` in the `.js` file in the React project.
