import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App.vue'

import TestOne from './components/TestOne.vue'
import HelloWorld from './components/HelloWorld.vue'
import RegistIn from './components/RegistIn.vue'
import LogIn from './components/LogIn.vue'
import store from '../src/store/store'

import Vuex from 'vuex'

Vue.use(Vuex)
new Vue({
  store: store,
  render: h => h(App),
}).$mount('#app')

const routes = [
  { path: '/test', component: TestOne },
  { path: '/hw', component: HelloWorld },
  { path: '/RegistIn', component: RegistIn },
  { path: '/LogIn', component: LogIn }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(ElementUI)

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
