import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import langJsx from '..'

fs.existsSync(path.join(__dirname, 'src-output'))

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  plugins: [
    langJsx(),
    {
      name: 'vite-plugin-lang-jsx-test',
      transform(code, id) {
        if (!fs.existsSync(id)) return

        if (/\/src\//.test(id)) {
          // Write transformed code to output/
          const filename = id.replace('src', 'src-output')
          const dirname = path.dirname(filename)
          if (!fs.existsSync(dirname)) fs.mkdirSync(dirname)
          fs.writeFileSync(filename, code)
        }
      },
    },
    createVuePlugin({ jsx: true }),
  ]
})
