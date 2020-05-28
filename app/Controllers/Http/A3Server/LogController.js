'use strict'

const path = require('path')

const A3Logs = use('App/Services/A3Logs')
const Config = use('App/Models/Config')

class LogController {
  async index () {
    return await A3Logs.getFiles()
  }

  async show ({ params }) {
    return await A3Logs.getLogs(params.profileName, params.filename)
  }

  async current ({ response }) {
    const logs = await A3Logs.current()
    return response.ok({
      logs
    })
  }

  async download ({ params, response}) {
    const config = await Config.first()
    return response.attachment(path.join(config.a3server_path, 'styx', params.profileName, params.filename))
  }

  async destroy ({ params, response }) {
    await A3Logs.deleteFile(params.profileName, params.filename)
    return response.ok()
  }
}

module.exports = LogController
