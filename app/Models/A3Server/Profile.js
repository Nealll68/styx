'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Profile extends Model {
    static get table () {
        return 'a3_server_profiles'
    }

    serverConfig () {
        return this.hasOne('App/Models/A3Server/Config')
    }

    serverBasic () {
        return this.hasOne('App/Models/A3Server/Basic')
    }

    serverParam () {
        return this.hasOne('App/Models/A3Server/Param')
    }

    serverDifficulty () {
        return this.hasOne('App/Models/A3Server/Difficulty')
    }

    getIsDefault (isDefault) {
        return isDefault === 1 ? true : false
    }
}

module.exports = Profile
