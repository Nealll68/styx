import Vue from 'vue'
import Snackbar from '@/components/Snackbar'

function Install (Vue, options) {
    const vuetify = options.vuetify
    delete options.vuetify

    function createSnackbar ({ type, message }) {
        const ComponentClass = Vue.extend(Object.assign({ vuetify }, Snackbar))
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
    }

    Vue.prototype.$snackbar = createSnackbar
}

export default ({ app }) => {
    Vue.use(Install, { vuetify: app.vuetify })
}