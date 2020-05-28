'use strict'

const Ws = use('Ws')

const Mission = use('App/Models/A3Server/Mission')
const MissionService = use('App/Services/Mission')

class MissionController {
    async index () {
        return await Mission.all()
    }

    async store ({ request, response }) {
        const mission_file = request.file('file')

        try {
            await MissionService.store(mission_file)

            const missionSplit = mission_file.fileName.split('.')

            const mission = await Mission.findBy('filename', mission_file.fileName)
            if (mission) {
                mission.merge({
                    name: missionSplit[0],
                    map: missionSplit[1],
                    size: mission_file.size,
                    filename: mission_file.fileName,
                    source: 'Local'
                })

                await mission.save()
            } else {
                await Mission.create({
                    name: missionSplit[0],
                    map: missionSplit[1],
                    size: mission_file.size,
                    filename: mission_file.fileName,
                    source: 'Local'
                })
            }
            
            return response.ok()
        } catch (ex) {
            return response.status(ex.status).send(ex.code)
        }
    }

    async storeWorkshop ({ request, response }) {
        const { workshopId, title, fileSize, fileUrl, filename } = request.all()

        const downloadWS = Ws.getChannel('download-info').topic('download-info')
        
        if (downloadWS) downloadWS.broadcast('start', { 
                            type: 'downloadMission',
                            missionName: title
                        })

        await MissionService.storeWorkshop(fileUrl, filename)

        const mission = await Mission.findBy('filename', filename)
        if (mission) {
            mission.merge({
                name: title,
                map: filename.split('.')[1],
                size: fileSize,
                filename,
                source: 'Workshop',
                workshop_id: workshopId
            })

            await mission.save()
        } else {
            await Mission.create({
                name: title,
                map: filename.split('.')[1],
                size: fileSize,
                filename,
                source: 'Workshop',
                workshop_id: workshopId
            })
        }

        if (downloadWS) downloadWS.broadcast('stop')        
        return response.ok()
    }

    async detect ({ response }) {
        try {
            for (const mission of await MissionService.get()) {
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

        await MissionService.delete(mission.filename)
        await mission.delete()

        return response.ok()
    }
}

module.exports = MissionController
