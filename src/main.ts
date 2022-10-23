import { createApp } from 'vue';
import App from './App.vue';
import { nutUiComponents } from './plugins/nutUI';
import { i18n } from '/@/i18n';
import router from '/@/router';
import store from '/@/store';
import './assets/font/iconfont.css';
import './assets/app.css';

const app = createApp(App);

// 路由
app.use(router);

// 国际化
app.use(i18n);

// 状态管理
app.use(store);

// nutUi按需加载
nutUiComponents.forEach((item) => {
  app.use(item as any);
});

app.mount('#app');
