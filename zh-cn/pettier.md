### <span id="pettier">✅ Eslint + Pettier 统一开发规范 </span>

VScode 安装 `eslint` `prettier` `vetur` 插件

在文件 `.prettierrc` 里写 属于你的 pettier 规则

```bash
{
   "printWidth": 120,
   "tabWidth": 2,
   "singleQuote": true,
   "trailingComma": "none",
   "semi": false,
   "wrap_line_length": 120,
   "wrap_attributes": "auto",
   "proseWrap": "always",
   "arrowParens": "avoid",
   "bracketSpacing": false,
   "jsxBracketSameLine": true,
   "useTabs": false,
   "overrides": [{
       "files": ".prettierrc",
       "options": {
           "parser": "json"
       }
   }]
}
```

Vscode setting.json 设置

```bash
    "[vue]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
     // 保存时用eslint格式化
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    // 两者会在格式化js时冲突，所以需要关闭默认js格式化程序
    "javascript.format.enable": false,
    "typescript.format.enable": false,
    "vetur.format.defaultFormatter.html": "none",
    // js/ts程序用eslint，防止vetur中的prettier与eslint格式化冲突
    "vetur.format.defaultFormatter.js": "none",
    "vetur.format.defaultFormatter.ts": "none",
```
