/* eslint-disable camelcase */
import BaseModel from "./BaseModel";

export default class Loads extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return "Load";
  }

  // Objection.js assumes primary key is `id` by default
  static get jsonSchema() {
    return {
      type: "object",
      required: ["Duration", "Start"],
      anyOf: [
        {
          required: ["PhoneNum"],
        },
        {
          required: ["Email"],
        },
      ],
      properties: {
        MachineId: { type: "integer" },
        Duration: { type: "integer" },
        Start: { type: "string", format: "date-time" },
        End: { type: "string", format: "date-time" },
        PhoneNum: { type: ["string", "null"] },
        Email: { type: ["string", "null"] },
      },
    };
  }
}
