export default function ({ $axios, app }) {  
    $axios.onError(error => {
    switch (error.response.data) {
            case 'E_A3_FOLDER_PATH_UNDEFINED':
                app.$toast.global.appError('Le chemin vers le dossier d\'Arma 3 n\'est pas défini')
                break
            case 'E_STEAMCMD_FOLDER_UNAVAILABLE_PATH':
                app.$toast.global.appError('Le chemin spécifié pour SteamCMD ne contient pas "steamcmd.exe"')
                break
            case 'E_STEAMCMD_PATH_REQUIRED':
                app.$toast.global.appError('Le chemin vers le dossier SteamCMD n\'est pas défini')
                break
            case 'E_STEAM_ACCOUNT_REQUIRED':
                app.$toast.global.appError('Un compte steam est requis pour effectuer cette action')
                break
        }
    })
  }