const { defineConfig } = require("@vue/cli-service");
const Component = require("unplugin-vue-components/webpack");
const {
  VarletUIResolver,
  VantResolver,
} = require("unplugin-vue-components/resolvers");
const AutoImport = require("unplugin-auto-import/webpack");
const path = require("path"); //试过用import直接报错了

const resolve = (dir) => path.join(__dirname, dir);

const NutUIResolver = () => {
  return (name) => {
    if (name.startsWith("Nut")) {
      const partialName = name.slice(3);
      return {
        name: partialName,
        from: "@nutui/nutui",
        sideEffects: `@nutui/nutui/dist/packages/${partialName.toLowerCase()}/style`,
      };
    }
  };
};

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      Component({
        resolvers: [VarletUIResolver(), VantResolver(), NutUIResolver()],
      }),
      AutoImport({
        imports: ["vue", "vue-router", "vuex"],
        eslintrc: {
          enabled: false, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成
          filepath: "./.eslintrc-auto-import.json", // 生成json文件,eslintrc中引入
          globalsPropValue: true,
        },
      }),
    ],
    resolve: {
      alias: {
        "@": resolve("./src"),
      },
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@nutui/nutui/dist/styles/variables.scss";@import '@/styles/mixin.scss';`,
      },
    },
  },
});
