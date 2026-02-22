// * Next
import type { NextApiRequest, NextApiResponse } from "next";

import path from "path";

// * NPM
import dayjs from "dayjs";

// * Helpers
import { logger } from "./logger";
import { iJWTdata, verifyJWT } from "./signVerifyJWT";

interface iErrorHandler {
  req: NextApiRequest;
  res: NextApiResponse;
  level?: "error" | "warn" | "info";
  err: {
    errno?: number;
    code?: string;
    message: string;
    options?: {
      url: { origin: string; pathname: string; search: string };
      protocol: string;
      username: string;
      password: string;
      host: string;
      port: string;
      body: {};
      headers: {};
      method: string;
    };
    timings?: { start: Date; end: Date; duration: number };
  };
  file?: string;
  subject?: string;
  status?: number;
  sendToClient?: boolean;
}

export default async function errorHandler({
  req,
  res,
  level,
  err,
  file,
  subject,
  status,
  sendToClient,
}: iErrorHandler) {
  const { dealerCode, username } = <iJWTdata>await verifyJWT(req);
  const { errno, code, message, options, timings } = err;

  const logInfo = {
    errno: status || errno || 500,
    code,
    message: `${status || errno || 500} | ${message}`,
    file: file || path.basename(__filename),
    triggeredBy: { dealerCode, username },
    http: {
      url: `${options?.url.origin}${options?.url.pathname}${options?.url.search}`,
      protocol: options?.protocol,
      username: options?.username,
      password: options?.password,
      host: options?.host,
      port: options?.port,
      body: options?.body,
      headers: options?.headers,
      method: options?.method,
      timings: {
        start: dayjs(timings?.start).format("DD/MM/YYYY HH:mm:ss a"),
        end: dayjs(timings?.end).format("DD/MM/YYYY HH:mm:ss a"),
        duration: `${dayjs(timings?.end).diff(timings?.start, "ms")}ms`,
      },
    },
  };

  if (level === "error") logger.error(logInfo);
  if (level === "warn") logger.warn(logInfo);
  if (level === "info") logger.info(logInfo);

  if (sendToClient)
    return res
      .status(status || errno || 500)
      .json({ subject: subject || "Error", body: message });
}
