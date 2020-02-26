'use strict'

const Drive = use('Drive')
const Helpers = use('Helpers')

const _ = require('lodash')
const path = require('path')
const anzip = require('anzip')
const rimraf = Helpers.promisify(require('rimraf'))
const fs = Helpers.promisify(require('fs'))

const Config = use('App/Models/Config')
const A3ServerProfile = use('App/Models/A3Server/Profile')

const A3FolderPathUndefined = use('App/Exceptions/A3FolderPathUndefinedException')
const SteamCMDPathUndefined = use('App/Exceptions/SteamCMDPathUndefinedException')
const UnableToAccess = use('App/Exceptions/UnableToAccessException')
const InvalidFileExtension = use('App/Exceptions/InvalidFileExtensionException')

class FileManager {

    async write (type, profile, data) {
        try {
            const config = await Config.first()

            if (!config.a3server_path) throw new A3FolderPathUndefined()

            if (type === 'config') {
                if (data.motd) data.motd = data.motd.split(';')
                if (data.mission_name) data.mission_name = data.mission_name.split(';')
            }

            const template = await Drive.get(Helpers.appRoot(`app/Services/serverFilesTemplates/server${_.upperFirst(type)}.template`), 'UTF-8')
            const templateFn = _.template(template)
            const content = templateFn(data)

            await Drive.put(path.join(config.a3server_path, 'commander', profile.name, type === 'config' ? 'server.cfg' : `${profile.name}.ArmaProfile`), content)
        } catch (ex) {
            throw ex
        }
    }

    async storeLocalMod (file) {
        const config = await Config.first()

        if (!config.a3server_path) throw new A3FolderPathUndefined()
        if (file.extname !== 'zip') throw new InvalidFileExtension()

        await file.move(config.a3server_path, {
            overwrite: true
        })

        if (!file.moved()) throw file.error()

        const zipPath = path.join(config.a3server_path, file.fileName)

        await anzip(zipPath, { outputPath : config.a3server_path })
        await Drive.delete(zipPath)
    }

    async getLocalMods () {
        const config = await Config.first()
        if (!config.a3server_path) throw A3FolderPathUndefined()

        return await fs.readdir(config.a3server_path, { withFileTypes: true })
    }

    async getWorkshopMods () {
        const config = await Config.first()
        if (!config.a3server_path) throw A3FolderPathUndefined()
        if (!config.steamcmd_path) throw SteamCMDPathUndefined()

        return await fs.readdir(path.join(config.steamcmd_path, 'steamapps', 'workshop', 'content', '107410'), { withFileTypes: true })
    }

    async logFiles () {
        const config = await Config.first()
        const profiles = await A3ServerProfile.all()

        let returnData = []
        for (const profile of profiles.toJSON()) {
            const files = await fs.readdir(path.join(config.a3server_path, 'commander', profile.name))
            returnData.push({
                profile_name: profile.name,
                files: files.filter(file => file.endsWith('.rpt')).reverse()
            })
        }

        return returnData
    }

    async currentLog () {
        const config = await Config.first()
        const profile = await A3ServerProfile.findBy('isDefault', true)
        const profileFolder = path.join(config.a3server_path, 'commander', profile.name)

        const files = await fs.readdir(profileFolder)
        const logFiles = files.filter(file => file.endsWith('.rpt'))
        /*const lastLogFile = _.maxBy(logFiles.filter(file => file.endsWith('.rpt')), file => {
            return fs.statSync(path.join(profileFolder, file)).ctime
        })*/

        return await Drive.get(path.join(profileFolder, logFiles[logFiles.length - 1]), 'UTF-8')
    }

    async getLogs (profileName, filename) {
        const config = await Config.first()
        return await Drive.get(path.join(config.a3server_path, 'commander', profileName, filename), 'UTF-8')
    }

    async deleteProfileFolder (profileName) {
        try {
            const config = await Config.first()

            if (!config.a3server_path) throw new A3FolderPathUndefined()

            await rimraf(path.join(config.a3server_path, 'commander', profileName))
        } catch (ex) {
            throw ex
        }
    }

    async deleteLogs (profileName, filename) {
        const config = await Config.first()
        await Drive.delete(path.join(config.a3server_path, 'commander', profileName, filename))
    }

    async deleteMod (workshopItemID, workshopItemName) {
        try {
            const config = await Config.first()      

            if (!config.steamcmd_path) {
                throw new SteamCMDPathUndefined()
            } else if (!config.a3server_path) {
                throw new A3FolderPathUndefined()
            }            

            if (await fs.access(path.join(config.a3server_path, workshopItemName), fs.constants.R_OK | fs.constants.W_OK)) throw new UnableToAccess()
            
            await fs.unlink(path.join(config.a3server_path, workshopItemName))

            if (await fs.access(path.join(config.steamcmd_path, 'steamapps', 'workshop', 'content', '107410', `${workshopItemID}`), fs.constants.R_OK | fs.constants.W_OK)) throw new UnableToAccess()

            await rimraf(path.join(config.steamcmd_path, 'steamapps', 'workshop', 'content', '107410', `${workshopItemID}`))
        } catch (ex) {
            throw ex
        }
    }

    async deleteLocalMod (name) {
        try {
            const config = await Config.first()      

            if (!config.a3server_path) throw new A3FolderPathUndefined()

            if (await fs.access(path.join(config.a3server_path, name), fs.constants.R_OK | fs.constants.W_OK)) throw new UnableToAccess()

            await rimraf(path.join(config.a3server_path, name))
        } catch (ex) {
            throw ex
        }
    }
}

module.exports = new FileManager()