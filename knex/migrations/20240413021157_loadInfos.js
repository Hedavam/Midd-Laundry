/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema.createTable("LoadInfos", (table) => {
    table.increments("Load_ID").primary();
    table.string("Phone_num");
    table.string("Email");
    table.integer("Machine_ID").unique().notNullable();
    table.integer("Duration").notNullable();
    table.string("Room").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("LoadInfos");
};
