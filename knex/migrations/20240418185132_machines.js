/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema.createTable("MachineInfos", (table) => {
    table.increments("Machine_ID").primary();
    table.string("Room").notNullable();
    table.integer("Machine_num").notNullable();
    table.string("Status").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("MachineInfos");
};
