exports.up = (knex) => knex.schema.createTable('users', (table) => {
  table.uuid('id').defaultTo(knex.fn.uuid());

  table.string('name').notNullable();
  table.string('email').notNullable().unique();
  table.string('password').notNullable();
  table.enu('role', ['admin', 'user']).default('user').notNullable();

  table.timestamp('created_at').default(knex.fn.now());
  table.timestamp('update_at').default(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('users');
