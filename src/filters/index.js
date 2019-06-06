import Vue from 'vue'
import * as filter from './filter'

Object.keys(filter).forEach(k => Vue.filter(k, filter[k]))

Vue.prototype.$formatDate = Vue.filter('formatDate')
Vue.prototype.$encodeUnicode = Vue.filter('encodeUnicode')
Vue.prototype.$decodeUnicode = Vue.filter('decodeUnicode')
Vue.prototype.$formatMoney = Vue.filter('formatMoney')
Vue.prototype.$formatCentMoney = Vue.filter('formatCentMoney')
Vue.prototype.$formatName = Vue.filter('formatName')
Vue.prototype.$formatPercent = Vue.filter('formatPercent')
