/* eslint-disable camelcase */
// import { Model } from "objection";
import BaseModel from "./BaseModel";

export default class Machines extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return "MachineInfos";
  }

  // Objection.js assumes primary key is `id` by default

  static get jsonSchema() {
    return {
      type: "object",
      required: ["Machine_num", "Machine_ID", "Status", "Room"],
      properties: {
        Machine_num: { type: "integer" },
        Machine_ID: { type: "integer" },
        Status: { type: "string" },
        Room: { type: "string" },
      },
    };
  }
}
