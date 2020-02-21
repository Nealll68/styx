'use strict'

const Helpers = use('Helpers')
const fs = Helpers.promisify(require('fs'))
const path = require('path')

const Config = use('App/Models/Config')
const Mission = use('App/Models/A3Server/Mission')

const Drive = use('Drive')

const A3FolderPathUndefined = use('App/Exceptions/A3FolderPathUndefinedException')
const InvalidFileExtension = use('App/Exceptions/InvalidFileExtensionException')

class MissionController {
    async index () {
        return await Mission.all()
    }

    async store ({ request, response }) {
        const mission_file = request.file('file')

        try {
            const config = await Config.first()

            if (!config.a3server_path) throw new A3FolderPathUndefined()
            if (mission_file.extname !== 'pbo') throw new InvalidFileExtension()

            await mission_file.move(path.join(config.a3server_path, 'MPMissions'), {
                overwrite: true
            })

            if (!mission_file.moved()) {
                return response.internalServerError(mission_file.error())
            }

            const missionSplit = mission_file.fileName.split('.')

            const mission = await Mission.findBy('filename', mission_file.fileName)
            if (mission) {
                mission.merge({
                    name: missionSplit[0],
                    map: missionSplit[1],
                    size: mission_file.size,
                    filename: mission_file.fileName
                })

                await mission.save()
            } else {
                await Mission.create({
                    name: missionSplit[0],
                    map: missionSplit[1],
                    size: mission_file.size,
                    filename: mission_file.fileName
                })
            }
            
            return response.ok()
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }

    async detect ({ response }) {
        try {
            const config = await Config.first()
    
            if (!config.a3server_path) throw new A3FolderPathUndefined()
    
            const files = await fs.readdir(path.join(config.a3server_path, 'MPMissions'))
            const missions = files.filter(element => path.extname(element) === '.pbo')
    
            for (const mission of missions) {
                const exist = await Mission.findBy('filename', mission)
                
                if (!exist) {
                    const missionSplit = mission.split('.')
                    const stat = await fs.stat(path.join(config.a3server_path, 'MPMissions', mission))
                    
                    await Mission.create({
                        name: missionSplit[0],
                        map: missionSplit[1],
                        size: stat.size,
                        filename: mission
                    })
                }
            }
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }

    async destroy ({ params, response }) {
        const config = await Config.first()
        const mission = await Mission.find(params.id)

        await Drive.delete(path.join(config.a3server_path, 'MPMissions', mission.filename))
        await mission.delete()

        return response.ok()
    }
}

module.exports = MissionController
