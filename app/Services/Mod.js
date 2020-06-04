'use strict'

const Drive = use('Drive')
const Helpers = use('Helpers')

const path = require('path')
const unzipper = require('unzipper')
const rimraf = Helpers.promisify(require('rimraf'))
const fs = Helpers.promisify(require('fs'))

const Config = use('App/Models/Config')

const A3FolderPathUndefined = use('App/Exceptions/A3FolderPathUndefinedException')
const SteamCMDPathUndefined = use('App/Exceptions/SteamCMDPathUndefinedException')
const UnableToAccess = use('App/Exceptions/UnableToAccessException')
const InvalidFileExtension = use('App/Exceptions/InvalidFileExtensionException')

class ModService {

  static async storeLocal (file) {
    const config = await Config.first()

    if (!config.a3server_path) throw new A3FolderPathUndefined()
    if (file.extname !== 'zip') throw new InvalidFileExtension()

    await file.move(Helpers.tmpPath(), { overwrite: true })

    if (!file.moved()) throw file.error()

    const zipPath = Helpers.tmpPath(file.fileName)

    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: config.a3server_path }))
      .on('close', async () => {
        await Drive.delete(zipPath)
      })
  }

  static async getLocal () {
    const config = await Config.first()
    if (!config.a3server_path) throw A3FolderPathUndefined()

    return await fs.readdir(config.a3server_path, { withFileTypes: true })
  }

  static async getWorkshop () {
    const config = await Config.first()
    if (!config.a3server_path) throw A3FolderPathUndefined()
    if (!config.steamcmd_path) throw SteamCMDPathUndefined()

    return await fs.readdir(path.join(config.steamcmd_path, 'steamapps', 'workshop', 'content', '107410'), { withFileTypes: true })
  }

  static async delete (workshopItemID, workshopItemName) {
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

  static async deleteLocal (name) {
    try {
      const config = await Config.first()      

      if (!config.a3server_path) throw new A3FolderPathUndefined()

      if (await fs.access(path.join(config.a3server_path, name), fs.constants.R_OK | fs.constants.W_OK)) throw new UnableToAccess()

      await rimraf(path.join(config.a3server_path, name))
    } catch (ex) {
      throw ex
    }
  }

}

module.exports = ModService