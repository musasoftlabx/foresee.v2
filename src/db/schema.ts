import mongoose from "mongoose";
import capitalize from "lodash/capitalize";

import { Schema } from "./mongoDB";
//mongoose.pluralize(null);
//const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    name: { type: String, required: true, index: true, unique: true },
    logo: String,
    isActive: { type: Boolean, default: true },
    created: { on: { type: Date, default: Date.now }, by: String },
    modified: { on: { type: Date, default: Date.now }, by: String },
    clients: [
      {
        name: { type: String, index: true, unique: true },
        added: { on: { type: Date, default: Date.now }, by: String },
        modified: { on: { type: Date, default: Date.now }, by: String },
      },
    ],
    stores: [
      {
        code: { type: String, required: true, index: true, unique: true },
        name: { type: String, required: true, index: true },
        country: String,
        client: String,
        audits: [
          {
            date: Date,
            barcode: {
              mode: { type: String, default: "strict" },
              characters: Number,
            },
            locations: [
              {
                code: { type: String, index: true, unique: true },
                physicalCount: { type: Number, default: 0 },
                systemCount: { type: Number, default: 0 },
                isVerified: { type: Boolean, default: false },
                created: { on: { type: Date, default: Date.now }, by: String },
                modified: { on: { type: Date, default: Date.now }, by: String },
              },
            ],
            products: [
              {
                barcode: { type: String, index: true, unique: true },
                location: { type: String, maxLength: 20 },
                attributes: Object,
                scanned: [
                  {
                    on: { type: Date, default: Date.now },
                    by: String,
                    device: String,
                  },
                ],
              },
            ],
          },
        ],
        created: { on: { type: Date, default: Date.now }, by: String },
        modified: { on: { type: Date, default: Date.now }, by: String },
      },
    ],
    users: [
      {
        firstName: {
          type: String,
          required: [true, "First name must be provided."],
          maxLength: [20, "First name cannot be more than 20 characters."],
          trim: true,
          set: (v: string) => capitalize(v),
        },
        lastName: {
          type: String,
          required: [true, "Last name must be provided."],
          maxLength: [20, "Last name cannot be more than 20 characters."],
          trim: true,
          set: (v: string) => capitalize(v),
        },
        emailAddress: {
          type: String,
          required: [true, "An email must be provided."],
          unique: true,
          lowercase: true,
          //validate: [isEmail, "The email provided is not valid."],
        },
        username: {
          type: String,
          //required: [true, "A username must be provided."],
          unique: true,
          lowercase: true,
        },
        password: {
          type: String,
          required: true,
          minLength: [8, "Password must be greater than 7 characters."],
        },
        avatar: String,
        roles: [String],
        added: { on: { type: Date, default: Date.now }, by: String },
        modified: { on: { type: Date, default: Date.now }, by: String },
      },
    ],
  },
  { autoIndex: false, autoCreate: false, strict: true },
);

const clientsSchema = new Schema(
  {
    client: { type: String, index: true, unique: true },
    added: { on: { type: Date, default: Date.now }, by: String },
    modified: { on: { type: Date, default: Date.now }, by: String },
  },
  { autoIndex: false, autoCreate: false, strict: true },
);

let clientsCollection =
  mongoose.models.client || mongoose.model("client", clientsSchema);
let accountCollection =
  mongoose.models.account || mongoose.model("account", accountSchema);

export { clientsSchema, clientsCollection, accountSchema, accountCollection };
