'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class A3ServerModsSchema extends Schema {
  up () {
    this.create('a3_server_mods', (table) => {
      table.increments()
      table.timestamps()
      table.string('name')
      table.integer('workshop_id')
      table.integer('size')
      table.string('source').defaultTo('Workshop')
      table.boolean('activated').defaultTo(false)
      table.boolean('server_mod').defaultTo(false)
      table.date('server_updated_at')
    })
  }

  down () {
    this.drop('a3_server_mods')
  }
}

module.exports = A3ServerModsSchema
