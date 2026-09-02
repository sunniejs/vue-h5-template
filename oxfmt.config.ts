import { defineConfig } from 'oxfmt';

/**
 * oxfmt 配置文件，移植自 vue-h5-template monorepo（turborepo-demo）的 @vh5/oxfmt-config。
 * 详见：https://oxc.rs/docs/guide/usage/formatter/config-file-reference.html
 */
export default defineConfig({
  /**
   * 单行长度，适配 prettier 的 80
   * Default：100
   */
  printWidth: 80,
  /**
   * 缩进宽度
   * Default：2
   */
  tabWidth: 2,
  /**
   * Markdown、MDX、YAML 文件格式化包裹
   * type: always | never | preserve
   * Default: preserve
   */
  proseWrap: 'never',
  /**
   * 结尾添加分号
   * Default：true
   */
  semi: true,
  /**
   * 使用单引号
   * Default：false
   */
  singleQuote: true,
  /**
   * 对象属性添加引号
   * Default：as-needed
   */
  quoteProps: 'as-needed',
  /**
   * 将多行元素的 > 放在最后一行的末尾，而不是单独放在下一行
   * Default：false
   */
  bracketSameLine: false,
  /**
   * 对象字面量的大括号间添加空格
   * Default：true
   */
  bracketSpacing: true,
  /**
   * 箭头函数参数总是使用括号
   * type: always | avoid
   * Default：always
   */
  arrowParens: 'always',
  /**
   * 配置 package.json 排序，但 oxfmt 不支持 pnpm-workspace
   * Default：true
   */
  sortPackageJson: false,
  /**
   * 配置 import 排序
   * Default：false
   */
  sortImports: false,
  /**
   * 多行结构中的后置逗号
   * Default：all
   */
  trailingComma: 'all',
  /**
   * 行尾换行符
   * type: lf | crlf | cr
   * Default: lf
   */
  endOfLine: 'lf',
  /**
   * 在文件最后插入一个换行
   * Default：true
   */
  insertFinalNewline: true,
  /**
   * 控制格式化文件中的嵌入语言（如 CSS-in-JS 或 JS-in-Vue）
   * Default：auto
   */
  embeddedLanguageFormatting: 'auto',
  /**
   * Vue/HTML/Angular/Handlebars 的空白敏感度（oxfmt 会格式化 <template>）
   * type: css | strict | ignore
   * Default：css
   */
  htmlWhitespaceSensitivity: 'css',

  overrides: [
    {
      files: [
        '*.json',
        '*.json5',
        '*.jsonc',
        '*.code-workspace',
        '**/*.json',
        '**/*.json5',
        '**/*.jsonc',
        '**/*.code-workspace',
      ],
      options: {
        trailingComma: 'none',
        quoteProps: 'preserve',
        singleQuote: false,
      },
    },
  ],
});
