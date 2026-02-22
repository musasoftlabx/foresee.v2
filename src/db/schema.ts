import mongoose from "mongoose";
import capitalize from "lodash/capitalize";

import { Schema } from "./mongoDB";
//mongoose.pluralize(null);
//const Schema = mongoose.Schema;

/* const ballotsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Ballot name must be provided."],
      maxLength: [50, "Ballot name cannot exceed 50 characters."],
      trim: true,
      set: (v: string) => capitalize(v),
    },
    ballot: { type: String, index: true, unique: true },
    description: {
      type: String,
      maxLength: [100, "description cannot exceed ${maxLength} characters."],
    },
    startsOn: { type: Date, required: [true, "Start date must be provided."] },
    endsOn: { type: Date, required: [true, "End date must be provided."] },
    authType: { type: String, required: [true, "Auth type is required."] },
    themeColor: String,
    logo: String,
    backdrop: String,
    dockets: [
      {
        docket: String,
        description: String,
        candidates: [
          {
            firstName: {
              type: String,
              required: [true, "First name must be provided."],
              maxLength: [20, "First name cannot be more than 20 characters."],
              trim: true,
              set: (v: string) => capitalize(v),
            },
            middleName: {
              type: String,
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
            nickName: {
              type: String,
              maxLength: [20, "First name cannot be more than 20 characters."],
              trim: true,
            },
            phoneNumber: String,
            age: Number,
            nationality: String,
            idNumber: String,
            party: String,
            photo: String,
            isDisqualified: Boolean,
            votes: Number,
            voters: [{ loginId: String, name: String, timestamp: Date }],
          },
        ],
      },
    ],
    voters: [
      {
        authId: {
          type: String,
          required: [true, "Auth Id must be provided."],
          maxLength: [20, "Auth Id cannot exceed 20 characters."],
          trim: true,
        },
        passcode: String,
        name: String,
        phoneNumber: String,
        emailAddress: String,
        loginTime: Date,
        logoutTime: Date,
        feedback: String,
        logs: { timestamp: String },
      },
    ],
  },
  { timestamps: true, strict: true }
); */

const clientsSchema = new Schema(
  {
    client: { type: String, index: true, unique: true },
    added: { on: { type: Date, default: Date.now }, by: String },
    modified: { on: { type: Date, default: Date.now }, by: String },
  },
  { strict: true },
);

const userSchema = new Schema(
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
      required: [true, "A username must be provided."],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must be greater than 7 characters."],
    },
    domain: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

let clientsCollection =
  mongoose.models.client || mongoose.model("client", clientsSchema);

//let ballotsCollection = mongoose.models.ballot || mongoose.model("ballot", ballotsSchema);

export {
  clientsSchema,
  clientsCollection,
  //ballotsCollection,
  //ballotsSchema,
};
