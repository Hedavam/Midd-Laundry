/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema.createTable("Machine", (table) => {
    table.increments("id").primary();
    table
      .integer("RoomId")
      .notNullable()
      .references("id")
      .inTable("Room")
      .onDelete("CASCADE"); /* Foreign key constraint */
    table.integer("MachineNum").notNullable();
    table.integer("Status").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Machine");
};
