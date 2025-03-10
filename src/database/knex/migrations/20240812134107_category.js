exports.up = knex => knex.schema.createTable('category', table => {
    table.increments('id').primary()
    table.text('name').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
  
  exports.down = knex => knex.schema.dropTable('category')
  