'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Profile extends Model {
    static get table () {
        return 'a3_server_profiles'
    }

    serverParam () {
        return this.hasOne('App/Models/A3Server/Param')
    }

    getIsDefault (isDefault) {
        return isDefault === 1 ? true : false
    }
}

module.exports = Profile
