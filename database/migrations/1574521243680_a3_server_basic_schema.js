'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class A3ServerBasicSchema extends Schema {
  up () {
    this.create('a3_server_basics', (table) => {
      table.increments()
      table.timestamps()

      table.integer('profile_id').unique().references('id').inTable('a3_server_profiles')
      
      table.integer('max_msg_send').defaultTo(128)
      table.integer('max_size_guaranteed').defaultTo(512)
      table.integer('max_size_non_guaranteed').defaultTo(256)
      table.integer('min_bandwidth').defaultTo(131072)
      table.integer('max_bandwidth').defaultTo(10000000000)
      table.integer('min_error_to_send').defaultTo(0.001)      
      table.integer('min_error_to_send_near').defaultTo(0.01)
    })
  }

  down () {
    this.drop('a3_server_basics')
  }
}

module.exports = A3ServerBasicSchema
