/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema.createTable("Load", (table) => {
    table.increments("id").primary();
    table
      .integer("MachineId")
      .notNullable()
      .references("id")
      .inTable("Machine")
      .onDelete("CASCADE");
    table.integer("Duration").notNullable();
    table.dateTime("Start");
    table.dateTime("End");
    table.string("PhoneNum");
    table.string("Email");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Load");
};
