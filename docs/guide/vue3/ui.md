# 多 UI 组件库供选择

使用 `unplugin-vue-components` 和 `unplugin-auto-import` 实现按需引入，无需手动注册组件。

## 使用组件库

Vant、Varlet 和 NutUI 三个组件库均已配置按需加载。

在 `build/vite/plugins/component.ts` 下配置：

```typescript
import { VantResolver, VarletUIResolver } from 'unplugin-vue-components/resolvers';
import NutUIResolver from '@nutui/auto-import-resolver';

// ...
resolvers: [VantResolver(), VarletUIResolver(), NutUIResolver()],
// ...
```

## 不需要某个组件库

只需删除对应的 resolvers 即可。

删除后需全局搜索删除不需要的组件，避免报错。

## 参考文档

- [NutUI](https://nutui.jd.com/#/zh-CN/component/button)

- [Vant](https://vant-ui.github.io/vant/#/zh-CN)

- [Varlet](https://varlet.pages.dev/#/zh-CN/button)
