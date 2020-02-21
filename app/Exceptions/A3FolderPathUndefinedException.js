'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class A3FolderPathUndefinedException extends LogicalException {
  constructor () {
    super('Le chemin vers le dossier d\'Arma 3 n\'est pas défini', 400, 'E_A3_FOLDER_PATH_UNDEFINED')
  }
}

module.exports = A3FolderPathUndefinedException
