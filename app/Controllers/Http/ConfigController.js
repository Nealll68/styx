'use strict'

const fs = require('fs')
const path = require('path')

const Config = use('App/Models/Config')

const SteamCMDFolderUnavailablePath = use('App/Exceptions/SteamCMDFolderUnavailablePathException')

class ConfigController {

    async index () {
        return await Config.first()
    }

    async update ({ request, response }) {
        const data = request.all()
        
        try {
            if (!(fs.existsSync(path.join(data.steamcmd_path, 'steamcmd.exe')))) {
                throw new SteamCMDFolderUnavailablePath()
            }

            const config = await Config.first()
            config.merge(data)            
            await config.save()

            return config
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }
    
}

module.exports = ConfigController
