'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class A3ServerMissionsSchema extends Schema {
  up () {
    this.table('a3_server_missions', (table) => {
      // alter table
      table.string('image').defaultTo('')
    })
  }

  down () {
    this.table('a3_server_missions', (table) => {
      // reverse alternations
    })
  }
}

module.exports = A3ServerMissionsSchema
