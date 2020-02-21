'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class SteamGuardRequiredException extends LogicalException {
  constructor () {
    super('Le code Steam Guard est requis', 400, 'E_STEAM_GUARD_REQUIRED')
  }
}

module.exports = SteamGuardRequiredException
