import Vue from 'vue'
import ConfirmDialog from '@/components/Confirm'

function Install (Vue, options) {
    const vuetify = options.vuetify
    delete options.vuetify

    function createDialog ({ type, title, message }) {
        const ComponentClass = Vue.extend(Object.assign({ vuetify }, ConfirmDialog))
        const container = document.querySelector('[data-app=true]') || document.body

        return new Promise(resolve => {
            const instance = new ComponentClass({
                propsData: { 
                    type,
                    title,
                    message
                },
                destroyed: () => {
                    container.removeChild(instance.$el)
                    resolve(instance.value)
                }
            })
            container.appendChild(instance.$mount().$el)
        })        
    }

    Vue.prototype.$confirm = createDialog
}

export default ({ app }) => {
    Vue.use(Install, { vuetify: app.vuetify })
}