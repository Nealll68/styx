const Drive = use('Drive')
const Helpers = use('Helpers')
const path = require('path')
const fs = Helpers.promisify(require('fs'))

const Config = use('App/Models/Config')
const A3Profile = use('App/Models/A3Server/Profile')

class A3Logs {
  
  static async getFiles () {
    const config = await Config.first()
    const profiles = await A3Profile.all()

    let logs = []
    for (const profile of profiles.toJSON()) {
      const files = await fs.readdir(path.join(config.a3server_path, 'styx', profile.name))

      for (const file of files.filter(f => f.endsWith('.rpt'))) {
        const reverseFilename = file.split('').reverse().join('')
        logs.push({
          name: file,
          profileName: profile.name,
          createdAt: reverseFilename.substring(4, 23).split('').reverse().join('')
        })   
      }
    }

    return logs
  }

  static async current () {
    const config = await Config.first()
    const profile = await A3Profile.findBy('isDefault', true)
    const profileFolder = path.join(config.a3server_path, 'styx', profile.name)

    const files = await fs.readdir(profileFolder)
    const logFiles = files.filter(file => file.endsWith('.rpt'))

    return await Drive.get(path.join(profileFolder, logFiles[logFiles.length - 1]), 'UTF-8')
  }

  static async getLogs (profileName, filename) {
      const config = await Config.first()
      return await Drive.get(path.join(config.a3server_path, 'styx', profileName, filename), 'UTF-8')
  }

  static async deleteFile (profileName, filename) {
      const config = await Config.first()
      await Drive.delete(path.join(config.a3server_path, 'styx', profileName, filename))
  }

}

module.exports = A3Logs