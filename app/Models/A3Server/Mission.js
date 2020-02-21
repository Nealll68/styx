'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Mission extends Model {
    static get table () {
        return 'a3_server_missions'
    }
}

module.exports = Mission
