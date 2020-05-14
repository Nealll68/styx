'use strict'

const Drive = use('Drive')
const Helpers = use('Helpers')

const _ = require('lodash')
const axios = require('axios')
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

    async write (type, profileName, data, reset = false) {
        try {
            const config = await Config.first()

            if (!config.a3server_path) throw new A3FolderPathUndefined()

            let filePath = path.join(config.a3server_path, 'styx', profileName, 'server.cfg')
            if (type === 'difficulty') {
                filePath = path.join(config.a3server_path, 'styx', profileName, 'Users', profileName, `${profileName}.Arma3Profile`)
            }

            if (reset) data = await Drive.get(Helpers.appRoot(`app/Services/serverFilesTemplates/server${_.upperFirst(type)}.template`), 'UTF-8')

            await Drive.put(filePath, data)
        } catch (ex) {
            throw ex
        }
    }

    async getFileContent (type, profileName) {
        const config = await Config.first()

        if (!config.a3server_path) throw new A3FolderPathUndefined()

        let filePath = path.join(config.a3server_path, 'styx', profileName, 'server.cfg')
        if (type === 'difficulty') {
            filePath = path.join(config.a3server_path, 'styx', profileName, 'Users', profileName, `${profileName}.Arma3Profile`)
        }

        return await Drive.get(filePath, 'UTF-8')
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

    async storeMission (file) {
        const config = await Config.first()

        if (!config.a3server_path) throw new A3FolderPathUndefined()
        if (file.extname !== 'pbo') throw new InvalidFileExtension()

        await file.move(path.join(config.a3server_path, 'MPMissions'), {
            overwrite: true
        })

        if (!file.moved()) throw file.error()
    }

    async storeWorkshopMission (fileUrl, filename) {
        const config = await Config.first()

        const response = await axios({
            method: 'get',
            url: fileUrl,
            responseType: 'stream'
        })
        response.data.pipe(fs.createWriteStream(path.join(config.a3server_path, 'MPMissions', filename)))
    }

    async getMissions () {
        const config = await Config.first()
    
        if (!config.a3server_path) throw new A3FolderPathUndefined()
        
        const files = await fs.readdir(path.join(config.a3server_path, 'MPMissions'))
        
        let missions = []
        for (const mission of files.filter(element => path.extname(element) === '.pbo')) {
            const missionInfo = mission.split('.')
            const stat = await fs.stat(path.join(config.a3server_path, 'MPMissions', mission))

            missions.push({
                name: missionInfo[0],
                map: missionInfo[1],
                size: stat.size,
                filename: mission
            })
        }

        return missions
    }

    async logFiles () {
        const config = await Config.first()
        const profiles = await A3ServerProfile.all()

        let returnData = []
        for (const profile of profiles.toJSON()) {
            const files = await fs.readdir(path.join(config.a3server_path, 'styx', profile.name))
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
        const profileFolder = path.join(config.a3server_path, 'styx', profile.name)

        const files = await fs.readdir(profileFolder)
        const logFiles = files.filter(file => file.endsWith('.rpt'))

        return await Drive.get(path.join(profileFolder, logFiles[logFiles.length - 1]), 'UTF-8')
    }

    async getLogs (profileName, filename) {
        const config = await Config.first()
        return await Drive.get(path.join(config.a3server_path, 'styx', profileName, filename), 'UTF-8')
    }

    async deleteProfileFolder (profileName) {
        try {
            const config = await Config.first()

            if (!config.a3server_path) throw new A3FolderPathUndefined()

            await rimraf(path.join(config.a3server_path, 'styx', profileName))
        } catch (ex) {
            throw ex
        }
    }

    async deleteLogs (profileName, filename) {
        const config = await Config.first()
        await Drive.delete(path.join(config.a3server_path, 'styx', profileName, filename))
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

    async deleteMission (filename) {
        const config = await Config.first()
        await Drive.delete(path.join(config.a3server_path, 'MPMissions', filename))
    }
}

module.exports = new FileManager()