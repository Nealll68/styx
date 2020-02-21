'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Mod extends Model {
    static get table () {
        return 'a3_server_mods'
    }
}

module.exports = Mod
