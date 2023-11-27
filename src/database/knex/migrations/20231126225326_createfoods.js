exports.up = (knex) => knex.schema.createTable('foods', (table) => {
  table.uuid('id').defaultTo(knex.fn.uuid());

  table.enu('type', ['snack', 'dessert', 'drink']).notNullable();
  table.string('name').notNullable();
  table.string('image').notNullable();
  table.json('ingredients').notNullable();
  table.string('price').notNullable();
  table.string('description').notNullable();

  table.timestamp('created_at').default(knex.fn.now());
  table.timestamp('update_at').default(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('foods');
