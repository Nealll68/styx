'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Param extends Model {
    static get table () {
        return 'a3_server_params'
    }
}

module.exports = Param
