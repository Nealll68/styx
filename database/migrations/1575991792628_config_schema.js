'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ConfigSchema extends Schema {
  up () {
    this.create('configs', (table) => {
      table.increments()
      table.timestamps()      
      table.string('steamcmd_path')
      table.string('a3server_path')
      table.integer('port').defaultTo(2302)
      table.boolean('x64').defaultTo(true)
      table.string('steam_account')
      table.string('steam_password')
      table.boolean('steam_guard').defaultTo(true)
    })
  }

  down () {
    this.drop('configs')
  }
}

module.exports = ConfigSchema
