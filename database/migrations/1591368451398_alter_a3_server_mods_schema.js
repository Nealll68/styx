'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class A3ServerModsSchema extends Schema {
  up () {
    this.table('a3_server_mods', (table) => {
      // alter table
      table.string('image').defaultTo('')
    })
  }

  down () {
    this.table('a3_server_mods', (table) => {
      // reverse alternations
    })
  }
}

module.exports = A3ServerModsSchema
