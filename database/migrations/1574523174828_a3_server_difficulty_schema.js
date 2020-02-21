'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class A3ServerDifficultySchema extends Schema {
  up () {
    this.create('a3_server_difficulties', (table) => {
      table.increments()
      table.timestamps()

      table.integer('profile_id').unique().references('id').inTable('a3_server_profiles')

      // Simulation
      table.boolean('reduced_damage').defaultTo(0)

      // Situational awareness
      table.integer('group_indicators').defaultTo(0)
      table.integer('friendly_tags').defaultTo(0)
      table.integer('enemy_tags').defaultTo(0)
      table.integer('detected_mines').defaultTo(0)
      table.integer('commands').defaultTo(1)
      table.integer('waypoints').defaultTo(1)
      table.boolean('tactical_ping').defaultTo(0)

      // Personal awareness
      table.integer('weapon_info').defaultTo(2)
      table.integer('stance_indicator').defaultTo(2)
      table.boolean('stamina_bar').defaultTo(0)
      table.boolean('weapon_crosshair').defaultTo(0)
      table.boolean('vision_aid').defaultTo(0)

      // View
      table.boolean('third_person_view').defaultTo(0)
      table.boolean('camera_shake').defaultTo(1)

      // Multiplayer
      table.boolean('score_table').defaultTo(1)
      table.boolean('death_messages').defaultTo(1)
      table.boolean('von_id').defaultTo(1)

      // Misc
      table.boolean('map_content').defaultTo(0)
      table.boolean('auto_report').defaultTo(0)
      table.boolean('multiple_saves').defaultTo(0)

      // AI
      table.integer('ai_level_preset').defaultTo(1)
      table.float('skill_ai').defaultTo(0.70)
      table.float('precision_ai').defaultTo(0.50)
    })
  }

  down () {
    this.drop('a3_server_difficulties')
  }
}

module.exports = A3ServerDifficultySchema
