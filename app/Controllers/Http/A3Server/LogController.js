'use strict'

const path = require('path')

const A3Server = use('App/Services/A3Server')
const Config = use('App/Models/Config')

class LogController {

    async index () {
        return await A3Server.logFiles()
    }

    async show ({ params }) {
        return await A3Server.getLogs(params.profileName, params.filename)
    }

    async download ({ params, response}) {
        const config = await Config.first()

        return response.attachment(path.join(config.a3server_path, 'commander', params.profileName, params.filename))
    }

    async destroy ({ params, response }) {
        await A3Server.deleteLogs(params.profileName, params.filename)
        return response.ok()
    }
}

module.exports = LogController
