// * NPM
import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, prettyPrint } = format;
const MongoDBTransport = require("winston-mongodb");

// * Helpers
import { logsPath } from "./configurePaths";

export const logger = createLogger({
  format: format.json(),
  transports: [
    new transports.Console({
      level: "info",
      format: combine(format.colorize(), format.simple()),
    }),
    new transports.File({
      filename: `${logsPath}/error.log`,
      level: "error",
      format: combine(timestamp(), prettyPrint()),
    }),
    new transports.File({
      filename: `${logsPath}/combined.log`,
    }),
    new MongoDBTransport({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      table: "logger",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}
