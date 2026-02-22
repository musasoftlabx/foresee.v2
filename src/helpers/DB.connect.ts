import Db from "mysql2-async";
import Redis from "ioredis";
import { dailyUserAuditReportCron } from "./crons";

export const DB = new Db({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  skiptzfix: true,
});

export const redis = new Redis({
  host: process.env.REDIS_DB_HOST,
  port: process.env.REDIS_DB_PORT,
  //password: "wakio5WkB8etEEJH9pIctFuTRlLrOodO",
});

// ? Run cronjob only on prod server
if (
  process.env.HOSTNAME !== "svdt1dirportal.safaricom.net" ||
  !process.env.HOSTNAME.includes("local")
)
  dailyUserAuditReportCron();
