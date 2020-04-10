import Vue from 'vue'
import Snackbar from '@/components/Snackbar'

export default ({ app }, inject) => {
  inject('snackbar', ({ type, message }) => {
    const ComponentClass = Vue.extend(Object.assign({ vuetify: app.vuetify }, Snackbar))
    const container = document.querySelector('[data-app=true]') || document.body

    const instance = new ComponentClass({
        propsData: { 
            type,
            message
        },
        destroyed: () => {
            container.removeChild(instance.$el)
        }
    })
    container.appendChild(instance.$mount().$el)
  })
}