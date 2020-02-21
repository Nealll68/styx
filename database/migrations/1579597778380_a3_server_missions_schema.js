'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class A3ServerMissionsSchema extends Schema {
  up () {
    this.create('a3_server_missions', (table) => {
      table.increments()
      table.timestamps()
      table.string('name')
      table.string('map')
      table.integer('size')
      table.string('filename')
    })
  }

  down () {
    this.drop('a3_server_missions')
  }
}

module.exports = A3ServerMissionsSchema
