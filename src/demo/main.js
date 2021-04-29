import Vue from 'vue';
import Demo from './Demo.vue';
import codeDiff from '../index';

Vue.use(codeDiff);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Demo),
}).$mount('#app');
