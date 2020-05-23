'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterA3SeverParamsSchema extends Schema {
  up () {
    this.table('a3_server_params', (table) => {
      // alter table
      table.boolean('custom_cfg')
    })
  }

  down () {
    this.table('a3_server_params', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AlterA3SeverParamsSchema
