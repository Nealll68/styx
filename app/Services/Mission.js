'use strict'

const Drive = use('Drive')
const Helpers = use('Helpers')

const path = require('path')

const Config = use('App/Models/Config')

const A3FolderPathUndefined = use('App/Exceptions/A3FolderPathUndefinedException')

class MissionService {

  static async store (file) {
    const config = await Config.first()

    if (!config.a3server_path) throw new A3FolderPathUndefined()
    if (file.extname !== 'pbo') throw new InvalidFileExtension()

    await file.move(path.join(config.a3server_path, 'MPMissions'), {
        overwrite: true
    })

    if (!file.moved()) throw file.error()
  }

  static async storeWorkshop (fileUrl, filename) {
    const config = await Config.first()

    const response = await axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream'
    })
    response.data.pipe(fs.createWriteStream(path.join(config.a3server_path, 'MPMissions', filename)))
  }

  static async get () {
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

  static async delete (filename) {
    const config = await Config.first()
    await Drive.delete(path.join(config.a3server_path, 'MPMissions', filename))
  }
}

module.exports = MissionService