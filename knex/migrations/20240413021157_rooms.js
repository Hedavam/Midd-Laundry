/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema.createTable("Room", (table) => {
    table.increments("id").primary();
    table.string("Name").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Room");
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
