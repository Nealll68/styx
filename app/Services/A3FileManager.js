'use strict'

const Drive = use('Drive')
const Helpers = use('Helpers')

const _ = require('lodash')
const path = require('path')
const rimraf = Helpers.promisify(require('rimraf'))

const Config = use('App/Models/Config')

const A3FolderPathUndefinedException = use('App/Exceptions/A3FolderPathUndefinedException')

class A3FileManager {

    async write (type, profile, data) {
        try {
            const config = await Config.first()

            if (!config.a3server_path) {
                throw new A3FolderPathUndefinedException()
            }

            if (type === 'config') {
                if (data.motd) data.motd = data.motd.split(';')
                if (data.mission_name) data.mission_name = data.mission_name.split(';')
            }

            const template = await Drive.get(Helpers.appRoot(`app/Services/serverFilesTemplates/server${_.upperFirst(type)}.template`), 'UTF-8')
            const templateFn = _.template(template)
            const content = templateFn(data)

            const profilePath = path.join(config.a3server_path, 'commander', profile.name)

            let filename
            if (type === 'config') {
                filename = path.join(profilePath, 'server.cfg')
            } else {
                filename = path.join(profilePath, `${profile.name}.ArmaProfile`)
            }

            await Drive.put(filename, content)
        } catch (ex) {
            throw ex
        }
    }

    async deleteProfileFolder (profileName) {
        try {
            const config = await Config.first()

            if (!config.a3server_path) {
                throw new A3FolderPathUndefinedException()
            }

            await rimraf(path.join(config.a3server_path, 'commander', profileName))
        } catch (ex) {
            throw ex
        }
    }
}

module.exports = new A3FileManager()