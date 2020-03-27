import Vue from 'vue'
import VuetifyConfirm from 'vuetify-confirm'

export default ({ app }) => {
    Vue.use(VuetifyConfirm, { 
        vuetify: app.vuetify,
        buttonTrueText: app.i18n.t('common.continue'), 
        buttonFalseText: app.i18n.t('common.cancel'),
        persistent: true
    })
}