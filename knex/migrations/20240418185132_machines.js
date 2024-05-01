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
    table.string("Type").notNullable();
    table
      .integer("Status")
      .notNullable(); /* 0 for in-order, 1 for out-of-order */
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Machine");
};
