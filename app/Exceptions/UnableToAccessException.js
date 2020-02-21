'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class UnableToAccessException extends LogicalException {
  constructor () {
    super(`Impossible d'accèder au dossier car il n'existe pas ou les droits sont insuffisants`, 500, 'E_UNABLE_TO_ACCESS')
  }
}

module.exports = UnableToAccessException
