exports.up = knex => knex.schema.createTable('dishes', table => {
    table.increments('id')
    table.text('name').notNullable()
    table.text('description')
    table.double('price',2)
    table.text('picture')
    table.integer('category_id').notNullable().references('id').inTable('category').onDelete('CASCADE')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable('dishes')