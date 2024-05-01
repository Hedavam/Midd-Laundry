/* eslint-disable camelcase */
import { Model } from "objection";
import BaseModel from "./BaseModel";
import Loads from "./Loads";

export default class Machines extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return "Machine";
  }

  // Objection.js assumes primary key is `id` by default
  static get jsonSchema() {
    return {
      type: "object",
      required: ["RoomId", "MachineNum", "OutOfOrder"],
      properties: {
        RoomId: { type: "integer" },
        MachineNum: { type: "integer" },
        Type: { type: "string" },
        OutOfOrder: { type: "boolean" },
      },
    };
  }

  /* One-to-many relation between Machines & Loads - foreign key on many side (Machine) */
  static relationMappings = {
    loads: {
      relation: Model.HasManyRelation,
      modelClass: Loads,
      join: {
        from: "Machine.id",
        to: "Load.MachineId",
      },
    },
  };
}
