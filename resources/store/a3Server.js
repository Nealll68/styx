export const state = () => ({
    isStarted: false
})

export const mutations = {
    start (state) {
        state.isStarted = true       
    },

    stop (state, code) {
        state.isStarted = false

        if (code === 'noProfile') {
            this.app.$snackbar({
                type: 'error',
                message: this.app.i18n.t('errors.undefinedDefaultProfile')
            })
        }
    }
}