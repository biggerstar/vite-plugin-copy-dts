import {defineConfig} from 'vite';
import {resolve} from "path";
import dts from 'vite-plugin-dts'
import {createRequire} from 'node:module'

const requireCjs = createRequire(__filename)
const {name: moduleName} = requireCjs('./package.json')

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
      copyDtsFiles: true,
    }),
  ],
  resolve: {
    extensions: [".ts", ".js", ".d.ts"],
  },
  build: {
    emptyOutDir: false,
    outDir: 'dist',
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src', `${moduleName}.ts`),
      name: moduleName,
      formats: ['es'],
      fileName: () => `${moduleName}.js`,
    },
    rollupOptions: {
      external: [
        'node:module',
        'node:process',
        'node:path',
        'node:fs',
        'node:url',
        'glob',
        'vite',
        'picocolors',
        'shelljs',
      ],
      output: {
        sourcemap: false,
      },
      treeshake: false
    },
  }
})
