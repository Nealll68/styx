'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class SteamCmdFolderUnavailablePathException extends LogicalException {
  constructor () {
    super('Le chemin spécifié pour SteamCMD ne contient pas "steamcmd.exe"', 400, 'E_STEAMCMD_FOLDER_UNAVAILABLE_PATH')
  }
}

module.exports = SteamCmdFolderUnavailablePathException
