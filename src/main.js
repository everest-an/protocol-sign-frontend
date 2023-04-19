import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {request} from './http';

const app = createApp(App);
app.config.globalProperties.$axios = request;
//import ElementPlus from 'element-plus'

//import 'element-plus/dist/index.css'
//import 'element-plus/lib/theme-chalk/index.css';
//import 'dayjs/locale/zh-cn'
//import locale from 'element-plus/lib/locale/lang/zh-cn'
// app.config.globalProperties.$axios = request;
// app.config.globalProperties.$tinymce = tinymce

//createApp(App).mount('#app')
app.use(store).use(router).mount('#app')