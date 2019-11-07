import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'weather-icons/css/weather-icons.min.css'
import 'weather-icons/css/weather-icons-wind.min.css'
import 'weather-icons/font/weathericons-regular-webfont.eot'
import 'weather-icons/font/weathericons-regular-webfont.svg'
import 'weather-icons/font/weathericons-regular-webfont.ttf'
import 'weather-icons/font/weathericons-regular-webfont.woff'
import 'weather-icons/font/weathericons-regular-webfont.woff2'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
