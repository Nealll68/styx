'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class A3ServerConfigSchema extends Schema {
  up () {
    this.create('a3_server_configs', (table) => {
      table.increments()
      table.timestamps()

      table.integer('profile_id').unique().references('id').inTable('a3_server_profiles')

      // Global settings
      table.string('hostname').defaultTo('My Arma 3 server')
      table.string('password').defaultTo('')
      table.string('password_admin').defaultTo('admin')
      table.string('server_command_password').defaultTo('admincommand')

      // Welcome message
      table.string('motd')
      table.integer('motd_interval').defaultTo(5)

      // Joining rules
      table.integer('max_players').defaultTo(32)
      table.boolean('kick_duplicate').defaultTo(1)
      table.integer('verify_signatures').defaultTo(0)
      table.integer('allowed_file_patching').defaultTo(0)
      
      // Voting
      table.integer('vote_mission_players').defaultTo(1)
      table.float('vote_threshold').defaultTo(0.33)

      // Ingame settings
      table.boolean('disable_von').defaultTo(true)
      table.integer('von_codec').defaultTo(1)
      table.integer('von_codec_quality').defaultTo(30)
      table.boolean('persistent').defaultTo(false)
      table.string('timestamp_format').defaultTo('short')
      table.boolean('battleye').defaultTo(true)

      // Timeouts
      table.integer('disconnect_timeout').defaultTo(5)
      table.integer('max_desync').defaultTo(150)
      table.integer('max_ping').defaultTo(200)
      table.integer('max_packet_loss').defaultTo(50)
      
      // Scripting issues
      table.string('on_user_connected').defaultTo('')
      table.string('on_user_disconnected').defaultTo('')
      table.string('double_id_detected').defaultTo('')

      // Signature verification
      table.string('on_unsigned_data').defaultTo('kick (_this select 0)')
      table.string('on_hacked_data').defaultTo('kick (_this select 0)')
      table.string('on_different_data').defaultTo('')

      table.string('mission_name')
      table.string('mission_difficulty').defaultTo('Regular')
    })
  }

  down () {
    this.drop('a3_server_configs')
  }
}

module.exports = A3ServerConfigSchema
