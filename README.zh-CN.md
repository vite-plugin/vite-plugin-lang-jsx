# vite-plugin-lang-jsx

支持在 js 文件中写 jsx

[![npm package](https://nodei.co/npm/vite-plugin-lang-jsx.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/vite-plugin-lang-jsx)
[![NPM version](https://img.shields.io/npm/v/vite-plugin-lang-jsx.svg)](https://npmjs.org/package/vite-plugin-lang-jsx)
[![NPM Downloads](https://img.shields.io/npm/dm/vite-plugin-lang-jsx.svg)](https://npmjs.org/package/vite-plugin-lang-jsx)

[English](https://github.com/vite-plugin/vite-plugin-lang-jsx/#readme) | 简体中文


✅ 支持在 .vue 文件中写 jsx  
✅ 兼容 `create-react-app`  

## 安装

```bash
npm i vite-plugin-lang-jsx -D
```

## 使用

#### Vue2 工程

在使用 vite-plugin-vue2 时自动添加 lang="jsx" 到 `<script>` 标签上

🚧 该插件应该放到 `vite-plugin-vue2` 前面

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
    // ...其他插件
  ]
}
```

## API <sub><sup>(Define)</sup></sub>

```ts
export interface LangJsx {
  (options?: {
    filter?: (id: string) => boolean | void;
    /**
     * 使用 ast 检测 JSX, 默认使用正则.
     */
    useAst?: boolean;
  }): Plugin[];
}
```

## 原理

`.vue` 文件

```html
// 源代码
<script>
  export default {
    render() {
      return <div>Hello world!</div>;
    },
  }
</script>

// 转换后代码
<script lang="jsx">
  export default {
    render() {
      return <div>Hello world!</div>;
    },
  }
</script>
```

`.js` 文件

```js
// 源代码
import JsxComponent from './jsx-component'

// 添加 `lang.jsx` 尾缀
import JsxComponent from './jsx-component?lang.jsx'
```

## 意义

当我们将 @vue/cli 创建的 Vue2.x 项目升级到 Vite 时，会用到 vite-plugin-vue2 插件

1. 但是 vue-plugin-vue2 插件不能自动处理 `<script>` 标签中的 jsx 语法。所有需要添加 lang=jsx 到 `<script>` 标签上，以保证语法正常解析
2. 其次，该插件允许你在 .js 文件中写 jsx 语法

很多时候很多人喜欢在 React 工程中在 .js 文件中写 jsx
