const { defineConfig } = require("@vue/cli-service");
const Component = require("unplugin-vue-components/webpack");
const {
  VarletUIResolver,
  VantResolver,
} = require("unplugin-vue-components/resolvers");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      Component({
        resolvers: [VarletUIResolver(), VantResolver()],
      }),
    ],
  },
});
