'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class SteamAccountRequiredException extends LogicalException {
  constructor () {
    super('Un compte steam est requis pour effectuer cette action', 400, 'E_STEAM_ACCOUNT_REQUIRED')
  }
}

module.exports = SteamAccountRequiredException
