import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from '/@/router';
import i18n from '/@/lang';

import '/@/design/index.less';
import 'virtual:windi.css';
import 'virtual:svg-icons-register';

const app = createApp(App);
app.use(i18n);
setupRouter(app);
app.mount('#app');
