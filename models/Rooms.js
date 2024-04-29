/* eslint-disable camelcase */
import { Model } from "objection";
import BaseModel from "./BaseModel";
import Machines from "./Machines";

export default class Rooms extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return "Room";
  }

  // Objection.js assumes primary key is `id` by default
  static get jsonSchema() {
    return {
      type: "object",
      required: ["Name"],
      properties: {
        id: { type: "integer" },
        Name: { type: "string" },
      },
    };
  }

  /* One-to-many relation between Rooms & Machines - foreign key on many side (Rooms) */
  static relationMappings = {
    machines: {
      relation: Model.HasManyRelation,
      modelClass: Machines,
      join: {
        from: "Room.id",
        to: "Machine.RoomId",
      },
    },
  };
}
