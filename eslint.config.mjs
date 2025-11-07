import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import fs from 'fs'

const autoImport = JSON.parse(fs.readFileSync('./.eslintrc-auto-import.json', 'utf8'))

export default defineConfig([
   js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
    rules:{
      "vue/multi-word-component-names": "off"
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...autoImport.globals,
      },
    },
  },
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),
])
