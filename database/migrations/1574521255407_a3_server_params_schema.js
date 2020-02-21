'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class A3ServerParamsSchema extends Schema {
  up () {
    this.create('a3_server_params', (table) => {
      table.increments()
      table.timestamps()

      table.integer('profile_id').unique().references('id').inTable('a3_server_profiles')

      // Mods
      table.string('mods')
      table.string('server_mod')

      // Server options      
      table.boolean('auto_init')
      table.boolean('load_mission_to_memory')

      // Perfomance 
      table.boolean('no_logs')
      table.boolean('enable_ht')
      table.boolean('huge_pages')
    })
  }

  down () {
    this.drop('a3_server_params')
  }
}

module.exports = A3ServerParamsSchema
