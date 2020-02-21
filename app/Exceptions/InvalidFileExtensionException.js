'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class InvalidFileExtensionException extends LogicalException {
  constructor () {
    super('Extension de fichier invalide', 400, 'E_INVALID_FILE_EXTENSION')
  }
}

module.exports = InvalidFileExtensionException
