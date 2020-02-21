'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Basic extends Model {
    static get table () {
        return 'a3_server_basics'
    }
}

module.exports = Basic
