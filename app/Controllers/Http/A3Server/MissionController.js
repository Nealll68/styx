'use strict'

const Mission = use('App/Models/A3Server/Mission')
const FileManager = use('App/Services/FileManager')

class MissionController {
    async index () {
        return await Mission.all()
    }

    async store ({ request, response }) {
        const mission_file = request.file('file')

        try {
            await FileManager.storeMission(mission_file)

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
            for (const mission of await FileManager.getMissions()) {
                const exist = await Mission.findBy('filename', mission.filename)
                
                if (!exist) {
                    await Mission.create({
                        name: mission.name,
                        map: mission.map,
                        size: mission.size,
                        filename: mission.filename
                    })
                }
            }

            return response.ok()
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }

    async destroy ({ params, response }) {
        const mission = await Mission.find(params.id)

        await FileManager.deleteMission(mission.filename)
        await mission.delete()

        return response.ok()
    }
}

module.exports = MissionController
