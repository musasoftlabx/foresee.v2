// * NPM
import { MongoClient } from "mongodb";
import { createLogger, format, transports } from "winston";
const MongoDBTransport = require("winston-mongodb");

const { combine, timestamp, label, prettyPrint } = format;

const client = new MongoClient(`${process.env.MONGO_URI}/e-ballot-db`);
await client.connect();

export const logger = createLogger({
  format: format.json(),
  transports: [
    new transports.Console({
      level: "info",
      format: combine(format.colorize(), format.simple()),
    }),
    new transports.File({
      filename: "src/logs/error.log",
      level: "error",
      format: combine(timestamp(), prettyPrint()),
    }),
    new transports.File({ filename: "src/logs/combined.log" }),
    // new MongoDBTransport({
    //   db: await Promise.resolve(client),
    //   collection: "logs",
    // }),
  ],
});

if (process.env.NODE_ENV !== "production")
  logger.add(new transports.Console({ format: format.simple() }));

/* const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}; */
