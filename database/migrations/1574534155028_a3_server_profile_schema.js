'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class A3ServerProfileSchema extends Schema {
  up () {
    this.create('a3_server_profiles', (table) => {
      table.increments()
      table.timestamps()
      table.string('name').unique()
      table.boolean('isDefault').defaultTo(false)
    })
  }

  down () {
    this.drop('a3_server_profiles')
  }
}

module.exports = A3ServerProfileSchema
