/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

/* eslint-disable func-names */
/* eslint no-unused-vars: ["error", { "args": "none" }] */
const fs = require("fs");

exports.seed = function (knex) {
  const contents = fs.readFileSync("./data/test/machines.json");
  const data = JSON.parse(contents);

  // Deletes ALL existing entries
  // Use batch insert because we have too many articles for simple insert
  return knex
    .raw('ALTER SEQUENCE "Machine_id_seq" RESTART WITH 1')
    .then(() => knex("Machine").del())
    .then(() => knex.batchInsert("Machine", data, 100));
};
