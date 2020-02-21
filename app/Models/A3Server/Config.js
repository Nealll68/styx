'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Config extends Model {
    static get table () {
        return 'a3_server_configs'
    }

    profile () {
        return this.belongsTo('App/Models/A3Server/Profile')
    }
}

module.exports = Config
