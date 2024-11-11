# 多 UI 组件库供选择

Vite 构建工具，`使用 vite-plugin-style-import` 和 `unplugin-vue-components/vite` 实现按需引入。

## 安装插件

```bash
yarn add vite-plugin-style-import -D
yarn add unplugin-vue-components/vite -D
```

## 使用组件库

nutUI 没有按需加载的 resolvers，style 需要自己配置按需加载

在 `config/vite/plugins/styleImport.ts` 设置

```javascript
  // 按需加载样式文件
  ...
    createStyleImportPlugin({
      resolves: [NutuiResolve()],
    }),
  ...
```

项目在 `src/plugins/nutUI.ts` 下统一管理组件，用哪个引入哪个，无需在页面里重复引用

```javascript
// 按需全局引入nutUI组件
import Vue from "vue";
import { Button, Cell, CellGroup } from "@nutui/nutui";
export const nutUiComponents = [Button, Cell, CellGroup];

// 在main.ts文件中引入
nutUiComponents.forEach((item) => {
  app.use(item);
});
```

vant 和 varlet 可以使用组件按需加载

在`config/vite/plugins/component.ts`下

```javascript
import { VueUseComponentsResolver, VantResolver, VarletUIResolver } from 'unplugin-vue-components/resolvers';
...
resolvers: [VantResolver(), VarletUIResolver()],
...
```

## 不需要某个组件库

nutUI 需删除`src/plugins/nutUI.ts`和`main.ts`文件下的引入

vant 和 varlet 只需删除对应的 resolvers 即可

删除后需全局搜索删除不需要的组件，避免报错

## 参考文档

- [nutUI](https://nutui.jd.com/#/zh-CN/component/button)

- [vant](https://vant-contrib.gitee.io/vant/#/zh-CN)

- [varlet](https://varlet-varletjs.vercel.app/#/zh-CN/button)

- [quark-design](https://vue-quarkdesign.hellobike.com/#/)
