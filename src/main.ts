import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import 'virtual:uno.css';

import App from './App.vue';
import router from './router';

import 'echarts';
import VChart from 'vue-echarts';

import elementPlus from './plugins/element-index';

import directives from './directive/index';

const app = createApp(App);

app.component('VChart', VChart);

app.use(createPinia());
app.use(router);
app.use(elementPlus);
app.use(directives);

app.mount('#app');
