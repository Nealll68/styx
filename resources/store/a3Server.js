export const state = () => ({
    isStarted: false
})

export const mutations = {
    start (state) {
        state.isStarted = true       
    },

    stop (state, code) {
        state.isStarted = false
        state.logs = []

        if (code === 'noProfile') {
            this.$toast.global.appError('Spécifiez un profil par défaut pour démarrer le serveur')
        }
    }
}