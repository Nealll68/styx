'use strict'

const path = require('path')
const symlinkDir = require('symlink-dir')

const Helpers = use('Helpers')
const getFolderSize = Helpers.promisify(require('get-folder-size'))

const Mod = use('App/Models/A3Server/Mod')
const Config = use('App/Models/Config')

const SteamWebAPI = use('App/Services/SteamWebAPI')
const ModService = use('App/Services/Mod')

class ModController {

    async index () {
        return await Mod.all()
    }

    async indexLocal ({ response }) {
        const modFolders = await ModService.getLocal()
        
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
            await ModService.storeLocal(modFile)
            return response.ok()
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }

    async detectWorkshopMods ({ response }) {
        try {
            const config = await Config.first()

            const modFolders = await ModService.getWorkshop()
            const workshopIds = modFolders.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)

            for (const workshopId of workshopIds) {
                const exist = await Mod.findBy('workshop_id', workshopId)

                if (!exist) {
                    const workshopItemDetails = await SteamWebAPI.getFileDetails(workshopId)
                                    
                    const formatItemName = /\s/.test(workshopItemDetails.title) ? `@${workshopItemDetails.title.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').join('_')}`.toLowerCase() : `@${workshopItemDetails.title}`.toLowerCase()
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
    
            await ModService.delete(mod.workshop_id, mod.name)
    
            return response.ok()
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }

    async destroyLocal ({ params, response }) {
        try {
            const mod = await Mod.find(params.id)
            await mod.delete()

            await ModService.deleteLocal(mod.name)

            return response.ok()
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }
}

module.exports = ModController
