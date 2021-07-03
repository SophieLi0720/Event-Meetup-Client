import {createApp} from 'vue';
import App from './App.vue';
import routes from "@/assets/routes";
import ElementPlus from 'element-plus'
import {createRouter, createWebHistory} from 'vue-router';
import api from './assets/api';


const router = createRouter({
    routes,
    history: createWebHistory()
});


const app = createApp(App);

app.config.globalProperties.api = api;
app.use(router);
app.use(ElementPlus);
app.mount('#app');