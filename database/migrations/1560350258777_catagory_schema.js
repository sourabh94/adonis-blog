'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CatagorySchema extends Schema {
  up () {
    this.create('catagories', (table) => {
      table.increments()
      table.string('title').notNullable()
      table.string('body')
      table.integer('user_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('catagories')
  }
}

module.exports = CatagorySchema
