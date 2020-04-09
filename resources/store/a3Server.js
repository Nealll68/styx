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
            this.$snackbar({
                type: 'error',
                message: this.$t('errors.undefinedDefaultProfile')
            })
        }
    }
}