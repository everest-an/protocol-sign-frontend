import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App);
// app.config.globalProperties.$axios = request;
// app.config.globalProperties.$tinymce = tinymce

//createApp(App).mount('#app')
app.use(store).use(router).mount('#app')