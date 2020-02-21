'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Config extends Model {
    static get hidden () {
        return ['created_at', 'updated_at', 'id', 'steam_password']
    }
}

module.exports = Config
