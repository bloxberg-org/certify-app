import 'babel-polyfill'
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './components/App.vue'
import router from './router'
import store from './store'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.devtools = true
Vue.config.productionTip = false

Vue.use(Vuetify, {
  theme: {
    primary: '#21252A',
    secondary: '#ffffff',
    cardcolor: '#191D52',
    cardcoloraccent: '#7EBEC5',
    backgrounddisclaimer: '#eceff1',
    // secondary: '#ffffff',
    accent: '#bc477b',
    info: '#101535',
    // info: '#eceff1',
    error: '#FF5252',
    primaryapp: '#2A2F4A',
    secondaryapp: '#EDF0F5',
    // mainaccent: '#b32478',
    // mainaccentlight: '#bc477b',
    // maindark: '#8d0052'
    mainaccent: '#2476bb',
    mainaccentlight: '#57a9ee',
    maindark: '#0b5da2'
  }
})

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  template:
    // '<App :is-d-app-ready="isDAppReady" :current-view="currentView" :is-valid-user-but="isValidUserBut" @log-user-in="logUserIn" @log-user-out="logUserOut" />',
    '<App/>',
  components: { App }
})
