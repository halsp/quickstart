import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from '/@/router';

import '/@/design/index.less';
import 'virtual:windi.css';
import 'virtual:svg-icons-register';

const app = createApp(App);
setupRouter(app);
app.mount('#app');
