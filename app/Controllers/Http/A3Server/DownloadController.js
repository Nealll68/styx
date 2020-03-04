'use strict'

const Helpers = use('Helpers')
const Request = Helpers.promisify(require('request'))

const path = require('path')
const fs = require('fs')

const SteamCMD = use('App/Services/SteamCMD')

const Config = use('App/Models/Config')
const Mission = use('App/Models/A3Server/Mission')

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
    
    async downloadMission ({ request, response }) {
        const { workshopId, title, fileSize, fileUrl } = request.all()

        const config = await Config.first()
        const stream = fs.createWriteStream(path.join(config.a3server_path, 'MPMissions'))
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
