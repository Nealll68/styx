import Vue from 'vue'
import SteamGuardDialog from '@/components/SteamGuardDialog'

function Install (Vue, options) {
    const vuetify = options.vuetify
    delete options.vuetify

    function createDialog () {
        const ComponentClass = Vue.extend(Object.assign({ vuetify }, SteamGuardDialog))
        const container = document.querySelector('[data-app=true]') || document.body

        return new Promise(resolve => {
            const instance = new ComponentClass({
                destroyed: () => {
                    container.removeChild(instance.$el)
                    resolve(instance.value)
                }
            })
            container.appendChild(instance.$mount().$el)
        })        
    }

    Vue.prototype.$steamGuard = createDialog
}

export default ({ app }) => {
    Vue.use(Install, { vuetify: app.vuetify })
}