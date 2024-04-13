/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema.createTable("LoadInfos", (table) => {
    table.increments("Load Id").primary();
    table.string("Phone #");
    table.string("email");
    table.string("Machine ID").unique().notNullable();
    table.integer("Duration").notNullable();
    table.string("Room").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("LoadInfos");
};
