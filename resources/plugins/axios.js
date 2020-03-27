export default function ({ $axios, app }) {  
    $axios.onError(error => {
        switch (error.response.data) {
            case 'E_A3_FOLDER_PATH_UNDEFINED':
                app.$toast.global.appError(app.i18n.t('errors.undefinedArmaPath'))
                break
            case 'E_STEAMCMD_FOLDER_UNAVAILABLE_PATH':
                app.$toast.global.appError(app.i18n.t('errors.incorrectSteamPath'))
                break
            case 'E_STEAMCMD_PATH_REQUIRED':
                app.$toast.global.appError(app.i18n.t('errors.undefinedSteamPath'))
                break
            case 'E_STEAM_ACCOUNT_REQUIRED':
                app.$toast.global.appError(app.i18n.t('errors.steamAccountRequired'))
                break
        }
    })
  }