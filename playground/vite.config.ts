import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import UnpluginDynamicImportVars from '../src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    UnpluginDynamicImportVars(),
  ],
})
