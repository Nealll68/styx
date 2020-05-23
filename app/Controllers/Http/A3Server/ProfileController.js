'use strict'

const _ = require('lodash')

const A3ServerProfile = use('App/Models/A3Server/Profile')
const A3ServerParam = use('App/Models/A3Server/Param')

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
        try {
            const serverProfile = await A3ServerProfile.findByOrFail('name', params.id)
            const serverParams = await serverProfile.serverParam().fetch()
            
            let profileJSON = {
                profile: serverProfile.toJSON(),
                params: serverParams.toJSON()
            }
    
            return response.ok(profileJSON)
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
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

            await FileManager.write('config', profileData.name)
            await FileManager.write('difficulty', profileData.name)
            await FileManager.write('basic', profileData.name)

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
        const serverParams = await serverProfile.serverParam().fetch()

        await serverParams.delete()
        await serverProfile.delete()

        if (serverProfile.isDefault && await A3ServerProfile.getCount() > 0) {
            const newDefaultProfile = await A3ServerProfile.first()
            
            newDefaultProfile.merge({ isDefault: true })
            newDefaultProfile.save()
        }

        await FileManager.deleteProfileFolder(serverProfile.name)

        return response.ok()
    }

}

module.exports = ProfileController
