'use strict'

const anzip = require('anzip')
const path = require('path')
const symlinkDir = require('symlink-dir')

const Helpers = use('Helpers')
const fs = Helpers.promisify(require('fs'))
const getFolderSize = Helpers.promisify(require('get-folder-size'))
const Drive = use('Drive')

const Mod = use('App/Models/A3Server/Mod')
const Config = use('App/Models/Config')

const A3SteamCMD = use('App/Services/A3SteamCMD')
const SteamWebAPI = use('App/Services/SteamWebAPI')

const A3FolderPathUndefined = use('App/Exceptions/A3FolderPathUndefinedException')
const InvalidFileExtension = use('App/Exceptions/InvalidFileExtensionException')

class ModController {

    async index () {
        return await Mod.all()
    }

    async indexLocal ({ response }) {
        const config = await Config.first()

        const modFolders = await fs.readdir(config.a3server_path, { withFileTypes: true })
        
        return response.ok({
            modFolders: modFolders.filter(dirent => dirent.isDirectory() && dirent.name.substring(0, 1) === '@').map(dirent => dirent.name)
        })
    }

    async addLocalMod ({ request, response }) {
        const { name } = request.all()

        const config = await Config.first()

        const modSize = await getFolderSize(path.join(config.a3server_path, name))

        await Mod.create({
            name: name,
            size: modSize,
            workshop_id: null,
            source: 'Local',
            server_updated_at: Date.now()
        })

        return response.ok()
    }

    async upload ({ request, response }) {
        const modFile = request.file('file')

        try {
            const config = await Config.first()

            if (!config.a3server_path) throw new A3FolderPathUndefined()
            if (modFile.extname !== 'zip') throw new InvalidFileExtension()

            await modFile.move(config.a3server_path, {
                overwrite: true
            })

            if (!modFile.moved()) {
                return response.internalServerError(modFile.error())
            }

            const zipPath = path.join(config.a3server_path, modFile.fileName)

            await anzip(zipPath, { outputPath : config.a3server_path })
            await Drive.delete(zipPath)

            return response.ok()
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }

    async detectWorkshopMods ({ response }) {
        try {
            const config = await Config.first()

            const modFolders = await fs.readdir(path.join(config.steamcmd_path, 'steamapps', 'workshop', 'content', '107410'), { withFileTypes: true })
            const workshopIds = modFolders.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)

            for (const workshopId of workshopIds) {
                const exist = await Mod.findBy('workshop_id', workshopId)

                if (!exist) {
                    const steamResponse = await SteamWebAPI.getFileDetails(workshopId)
                    const workshopItemDetails = steamResponse.response.publishedfiledetails[0]
                                    
                    const formatItemName = `@${workshopItemDetails.title.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').join('_')}`
                    await symlinkDir(path.join(config.steamcmd_path, 'steamapps', 'workshop', 'content', '107410', `${workshopId}`), path.join(config.a3server_path, formatItemName))

                    await Mod.create({
                        name: formatItemName,
                        size: workshopItemDetails.file_size,
                        workshop_id: workshopId,
                        server_updated_at: Date.now()
                    })
                }
            }

            return response.ok()
        } catch (ex) {
            return response.status(ex.status).send(ex.code)  
        }
    }

    async destroy ({ params, response }) {
        try {
            const mod = await Mod.find(params.id)
            await mod.delete()
    
            await A3SteamCMD.deleteMod(mod.workshop_id, mod.name)
    
            return response.ok()
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }

    async destroyLocal ({ params, response }) {
        try {
            const mod = await Mod.find(params.id)
            await mod.delete()

            await A3SteamCMD.deleteLocalMod(mod.name)

            return response.ok()
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }
}

module.exports = ModController
