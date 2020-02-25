'use strict'

const _ = require('lodash')

const A3ServerProfile = use('App/Models/A3Server/Profile')
const A3ServerConfig = use('App/Models/A3Server/Config')
const A3ServerParam = use('App/Models/A3Server/Param')
const A3ServerDifficulty = use('App/Models/A3Server/Difficulty')

const FileManager = use('App/Services/FileManager')

const Config = use('App/Models/Config')

const A3FolderPathUndefined = use('App/Exceptions/A3FolderPathUndefinedException')

class ProfileController {

    async index ({ response }) {
        const serverProfiles = await A3ServerProfile.all()
        const serverProfilesJSON = serverProfiles.toJSON()

        return response.ok(_.orderBy(serverProfilesJSON, 'isDefault', 'desc'))
    }

    async show ({ params, response }) {
        const serverProfile = await A3ServerProfile.find(params.id)
        const serverConfig = await serverProfile.serverConfig().fetch()
        const serverParams = await serverProfile.serverParam().fetch()
        const serverDifficulty = await serverProfile.serverDifficulty().fetch()
        
        let profileJSON = {
            profile: serverProfile.toJSON(),
            params: serverParams.toJSON(),
            config: serverConfig.toJSON(),
            difficulty: serverDifficulty.toJSON()
        }

        return response.ok(profileJSON)
    }

    async store ({ request, response }) {
        const profileData = request.all()

        try {
            const config = await Config.first()
            if (!config.a3server_path) throw new A3FolderPathUndefined()

            if (await A3ServerProfile.getCount() === 0) {
                profileData.isDefault = true
            } else if (profileData.isDefault && await A3ServerProfile.getCount() > 0) {
                const defaultProfile = await A3ServerProfile.findBy('isDefault', true)
                
                defaultProfile.merge({ isDefault: false })
                await defaultProfile.save()
            }            

            const serverProfile = await A3ServerProfile.create(profileData)
            await A3ServerParam.create({ profile_id: serverProfile.id })
            await A3ServerConfig.create({ profile_id: serverProfile.id })
            await A3ServerDifficulty.create({ profile_id: serverProfile.id })   

            const serverConfig = await A3ServerConfig.findBy('profile_id', serverProfile.id)
            const serverDifficulty = await A3ServerDifficulty.findBy('profile_id', serverProfile.id)

            await FileManager.write('config', serverProfile, serverConfig.toJSON())
            await FileManager.write('difficulty', serverProfile, serverDifficulty.toJSON())

            await serverProfile.reload()
            return serverProfile
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }

    async update ({ params, request, response }) {
        const profileData = request.all()

        const serverProfile = await A3ServerProfile.find(params.id)

        if (profileData.isDefault) {
            const defaultProfile = await A3ServerProfile.findBy('isDefault', true)
            
            defaultProfile.merge({ isDefault: false })
            await defaultProfile.save()
        }

        serverProfile.merge(profileData)

        await serverProfile.save()

        return response.ok()
    }

    async destroy ({ params, response }) {
        const serverProfile = await A3ServerProfile.findOrFail(params.id)
        const serverConfig = await serverProfile.serverConfig().fetch()
        const serverParams = await serverProfile.serverParam().fetch()
        const serverDifficulty = await serverProfile.serverDifficulty().fetch()

        await serverConfig.delete()
        await serverParams.delete()
        await serverDifficulty.delete()
        await serverProfile.delete()

        if (serverProfile.default && await A3ServerProfile.getCount() > 0) {
            const newDefaultProfile = await A3ServerProfile.first()
            newDefaultProfile.merge({ isDefault: true })
            newDefaultProfile.save()
        }

        await FileManager.deleteProfileFolder(serverProfile.name)

        return response.ok()
    }

}

module.exports = ProfileController
