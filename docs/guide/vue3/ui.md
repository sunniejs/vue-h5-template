# 多 UI 组件库供选择

Vite 构建工具，`使用 vite-plugin-style-import` 和 `unplugin-vue-components/vite` 实现按需引入。

## 安装插件

```bash
pnpm add unplugin-vue-components/vite -D
```

## 使用组件库

vant 、 varlet 和 nutUI 可以使用组件按需加载

在`config/vite/plugins/component.ts`下

```javascript
import { VantResolver, VarletUIResolver } from 'unplugin-vue-components/resolvers';
import NutUIResolver from '@nutui/auto-import-resolver';
...
resolvers: [VantResolver(), VarletUIResolver(), NutUIResolver()],
...
```

## 不需要某个组件库

只需删除对应的 resolvers 即可

删除后需全局搜索删除不需要的组件，避免报错

## 参考文档

- [nutUI](https://nutui.jd.com/#/zh-CN/component/button)

- [vant](https://vant-contrib.gitee.io/vant/#/zh-CN)

- [varlet](https://varlet-varletjs.vercel.app/#/zh-CN/button)
