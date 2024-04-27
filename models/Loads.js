/* eslint-disable camelcase */
// import { Model } from "objection";
import BaseModel from "./BaseModel";

export default class Loads extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return "LoadInfos";
  }

  // Objection.js assumes primary key is `id` by default

  static get jsonSchema() {
    return {
      type: "object",
      oneOf: [
        {
          required: ["Phone #"],
        },
        {
          required: ["email"],
        },
      ],
      required: "Duration",
      properties: {
        Load_ID: { type: "integer" },
        Phone_num: { type: "string" },
        Email: { type: "string" },
        Machine_ID: { type: "integer" },
        Duration: { type: "integer" },
        Room: { type: "string" },
      },
    };
  }
}
