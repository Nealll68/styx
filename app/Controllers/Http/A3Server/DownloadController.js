'use strict'

const SteamCMD = use('App/Services/SteamCMD')

class DownloadController {

    async updateServer ({ request, response }) {
        const { steamGuard } = request.all()

        try {
            await SteamCMD.updateServer(steamGuard)
            response.ok()
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }

    async downloadWorskhop ({ request, response }) {
        const data = request.all()
        
        try {
            await SteamCMD.downloadWorkshop(data)
            return response.ok()
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }

    cancel ({ response }) {
        try {
            SteamCMD.cancel()
            return response.ok()
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }

}

module.exports = DownloadController
