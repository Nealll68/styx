'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Difficulty extends Model {
    static get table () {
        return 'a3_server_difficulties'
    }

    profile () {
        return this.belongsTo('App/Models/A3Server/Profile')
    }
}

module.exports = Difficulty
