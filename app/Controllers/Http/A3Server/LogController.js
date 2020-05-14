'use strict'

const path = require('path')

const FileManager = use('App/Services/FileManager')
const Config = use('App/Models/Config')

class LogController {

    async index () {
        return await FileManager.logFiles()
    }

    async show ({ params }) {
        return await FileManager.getLogs(params.profileName, params.filename)
    }

    async current ({ response }) {
        const logs = await FileManager.currentLog()
        return response.ok({
            logs
        })
    }

    async download ({ params, response}) {
        const config = await Config.first()

        return response.attachment(path.join(config.a3server_path, 'styx', params.profileName, params.filename))
    }

    async destroy ({ params, response }) {
        await FileManager.deleteLogs(params.profileName, params.filename)
        return response.ok()
    }
}

module.exports = LogController
