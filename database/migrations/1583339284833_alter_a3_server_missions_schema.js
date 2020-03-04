'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterA3ServerMissionsSchema extends Schema {
  up () {
    this.table('a3_server_missions', (table) => {
      // alter table
      table.integer('workshop_id')
      table.string('source')
    })
  }

  down () {
    this.table('a3_server_missions', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AlterA3ServerMissionsSchema
