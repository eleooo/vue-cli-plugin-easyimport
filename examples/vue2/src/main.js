import Vue from 'vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
window.Vue = Vue