'use strict'

const A3SteamCMD = use('App/Services/A3SteamCMD')

class DownloadController {

    async updateServer ({ request, response }) {
        const { steamGuard } = request.all()

        try {
            await A3SteamCMD.updateServer(steamGuard)
            response.ok()
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }

    async downloadWorskhop ({ request, response }) {
        const data = request.all()
        
        try {
            await A3SteamCMD.downloadWorkshop(data)
            return response.ok()
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }  

    cancel ({ response }) {
        try {
            A3SteamCMD.cancel()
            return response.ok()
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }

}

module.exports = DownloadController
