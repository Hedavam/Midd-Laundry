/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

/* eslint-disable func-names */
/* eslint no-unused-vars: ["error", { "args": "none" }] */
const fs = require("fs");

exports.seed = function (knex) {
  const contents = fs.readFileSync("./data/loads.json");
  const data = JSON.parse(contents);

  // Deletes ALL existing entries
  // Use batch insert because we have too many articles for simple insert
  return knex("Load")
    .del()
    .then(() => knex.batchInsert("Load", data, 100));
};
