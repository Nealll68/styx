export const state = () => ({
    type: null,
    title: null,
    logs: []
})

export const mutations = {
    init (state, value) {
        state.logs = []
        state.type = value.type

        switch (value.type) {
            case 'updateServer':
                state.title = 'Mise à jour du serveur en cours'
                break
            case 'downloadMod':
                state.title = `Téléchargement du mod : ${value.modName}`
                break
            case 'downloadMission':
                state.title = `Téléchargement de la mission ${value.missionName}`
                break
        }
    },
    
    addLogs (state, value) {        
        if (Array.isArray(value)) {
            state.logs = state.logs.concat(value)
        } else {
            state.logs.push(value)            
        }
    },

    stop (state, code) { 
        if (!code || code === 0) {
            switch (state.type) {
                case 'updateServer':
                    this.$toast.global.appSuccess('Serveur mis à jour')
                    break
                case 'downloadMod':
                    this.$toast.global.appSuccess('Mod téléchargé')
                    break
                case 'downloadMission':
                    this.$toast.global.appSuccess('Mission téléchargée')
                    break
            }           
        } else if (code === 5) {
            this.$toast.global.appError('Echec de connexion avec le code Steam Guard')
        } else if (code === 8) {
            this.$toast.global.appError('Echec : pas assez d\'espace ou le compte spécifié ne possède pas Arma 3')
        }

        state.type = null
        state.title = null
    }
}