import Vue from 'vue'
import Ws from '@adonisjs/websocket-client/index'

export default () => {
    Vue.prototype.$adonisWs = Ws
}