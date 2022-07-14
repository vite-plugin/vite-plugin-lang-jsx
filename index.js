const fs = require('fs');
const acorn = require('acorn');
const jsx = require('acorn-jsx');

/**
 * @type {import('./index').LangJsx}
 */
module.exports = function langJsx() {
  const LANG = 'jsx';
  const astExt = new AstExt;
  const name = 'vite-plugin-lang-jsx';
  // https://github.com/vitejs/vite/blob/e8c840abd2767445a5e49bab6540a66b941d7239/packages/vite/src/node/optimizer/scan.ts#L147
  const scriptRE = /(<script\b(?:\s[^>]*>|>))(.*?)<\/script>/gims;
  // https://github.com/vitejs/vite/blob/e8c840abd2767445a5e49bab6540a66b941d7239/packages/vite/src/node/optimizer/scan.ts#L151
  const langRE = /\blang\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/im;

  /**
   * @type {import('vite').ResolveFn}
   */
   let resolve;

   /**
   * @type {import('vite').Plugin}
   */
  const plugin1 = {
    name: `${name}:resolve`,
    enforce: 'pre',
    configResolved(config) {
      resolve = config.createResolver({ preferRelative: true });
    },
    async resolveId(source, importer) {
      if (source.startsWith('/@fs/')) return;
      if (source.startsWith('/@id/')) return;
      if (source.startsWith('/node_modules/')) return;
      if (source.startsWith('/@vite/')) return;
      if (source.startsWith('\0')) return;
      // At present, only `.js` files are supported.
      if (!source.endsWith('.js')) return;

      try {
        const resolved = await resolve(source, importer);
        if (resolved) {
          const code = fs.readFileSync(resolved, 'utf8');
          const isJsx = await astExt.checkJSX(code);
          if (isJsx) {
            // e.g. `head.vue?vue&type=script&lang.jsx` - (vite-plugin-vue2 handled)
            return resolved + '?lang.jsx';
          }
        }
      } catch (e) { }
    },
  };

  /**
   * @type {import('vite').Plugin}
   */
  const plugin2 = {
    name,
    config(config) {
      if (!config.optimizeDeps) config.optimizeDeps = {};
      if (!config.optimizeDeps.esbuildOptions) config.optimizeDeps.esbuildOptions = {};
      if (!config.optimizeDeps.esbuildOptions.plugins) config.optimizeDeps.esbuildOptions.plugins = [];

      // for vite "Dependency Pre-Bundling"
      config.optimizeDeps.esbuildOptions.plugins.push({
        name,
        async setup(build) {
          build.onLoad({ filter: /\.vue$/ }, async args => {
            const raw = fs.readFileSync(args.path, 'utf8');
            let js = '';
            let loader = 'js';
            let match = null;
            scriptRE.lastIndex = 0;
            // https://github.com/vitejs/vite/blob/e8c840abd2767445a5e49bab6540a66b941d7239/packages/vite/src/node/optimizer/scan.ts#L240
            while (match = scriptRE.exec(raw)) {
              const [, openTag, content] = match;
              const langMatch = openTag.match(langRE);
              const lang = langMatch && (langMatch[1] || langMatch[2] || langMatch[3]);
              if (['ts', 'tsx', 'jsx'].includes(lang)) {
                loader = lang;
              } else if (await astExt.checkJSX(content)) {
                loader = LANG;
              }
              js = content;
            }

            return {
              loader,
              contents: js,
            };
          });
        },
      });
    },
    async transform(code, id) {
      scriptRE.lastIndex = 0; // 🐞
      if (!(id.endsWith('.vue') && scriptRE.exec(code))) return;

      let loader = 'js';
      scriptRE.lastIndex = 0;
      const match = scriptRE.exec(code);
      const [, openTag, content] = match;
      const langMatch = openTag.match(langRE);
      const lang = langMatch && (langMatch[1] || langMatch[2] || langMatch[3]);
      if (['ts', 'tsx', 'jsx'].includes(lang)) {
        loader = lang;
      } else if (await astExt.checkJSX(content)) {
        loader = LANG;
      }

      return loader === 'js'
        ? undefined
        : code.replace(openTag, openTag.replace('>', ` lang="${loader}">`));
    },
    /* 
    async transform(code, id) {
      if (!id.endsWith('.vue')) return;

      let isJSX = false;
      const { script, customBlocks } = require('vue-template-compiler').parseComponent(code);

      if (script && script.content) {
        if (await astExt.checkJSX(script.content)) {
          isJSX = true;
        }
      }

      for (const block of customBlocks) {
        if (block.content && await astExt.checkJSX(block.content)) {
          isJSX = true;
          break;
        }
      }

      if (isJSX) {
        return code.replace('<script>', `<script lang="jsx">`);
      }
    }, 
    */
  };
  
  return [plugin1, plugin2];
};

class AstExt {
  constructor() {
    this.acornExt = acorn.Parser.extend(jsx());
  }

  deepWalk(ast, cb) {
    if (!ast) return;
    if (typeof ast === 'object') {
      for (const key of Object.keys(ast)) {
        const bool = cb({ [key]: ast[key] });
        if (bool === false) return;
        this.deepWalk(ast[key], cb);
      }
    }
    if (Array.isArray(ast)) {
      for (const item of ast) {
        const bool = cb(item);
        if (bool === false) return;
        this.deepWalk(item, cb);
      }
    }
  }

  async checkJSX(content) {
    return new Promise(resolve => {
      const ast = this.acornExt.parse(content, { sourceType: 'module', ecmaVersion: 'latest' });
      this.deepWalk(ast, node => {
        if (['JSXElement', 'JSXFragment'].includes(node.type)) {
          resolve(true);
          return false;
        }
      });
      resolve(false);
    });
  }
}
