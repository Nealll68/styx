'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class SteamCmdPathUndefinedException extends LogicalException {
  constructor () {
    super('Le chemin vers le dossier SteamCMD n\'est pas spécifié', 400, 'E_STEAMCMD_PATH_REQUIRED')
  }
}

module.exports = SteamCmdPathUndefinedException
