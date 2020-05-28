'use strict'

const Drive = use('Drive')
const Helpers = use('Helpers')

const _ = require('lodash')
const path = require('path')

const Config = use('App/Models/Config')

const A3FolderPathUndefined = use('App/Exceptions/A3FolderPathUndefinedException')

class FileManager {

    static async write (type, profileName, data = null) {
        try {
            const config = await Config.first()

            if (!config.a3server_path) throw new A3FolderPathUndefined()

            let filePath = path.join(config.a3server_path, 'styx', profileName, `${type === 'config' ? 'server' : type}.cfg`)
            if (type === 'difficulty') {
                filePath = path.join(config.a3server_path, 'styx', profileName, 'Users', profileName, `${profileName}.Arma3Profile`)
            }

            if (!data) data = await Drive.get(Helpers.appRoot(`app/Services/serverFilesTemplates/server${_.upperFirst(type)}.template`), 'UTF-8')

            await Drive.put(filePath, data)
        } catch (ex) {
            throw ex
        }
    }

    static async getFileContent (type, profileName) {
        const config = await Config.first()

        if (!config.a3server_path) throw new A3FolderPathUndefined()

        let filePath = path.join(config.a3server_path, 'styx', profileName, `${type === 'config' ? 'server' : type}.cfg`)
        if (type === 'difficulty') {
            filePath = path.join(config.a3server_path, 'styx', profileName, 'Users', profileName, `${profileName}.Arma3Profile`)
        }

        return await Drive.get(filePath, 'UTF-8')
    }

}

module.exports = FileManager