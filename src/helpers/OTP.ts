// * Next
import type { NextApiRequest, NextApiResponse } from "next";

// * NPM
import dayjs from "dayjs";

// * Helpers
import { redis } from "./DB.connect";
import sendSMS from "./sendSMS";

// * Helpers
import errorHandler from "./errorHandler";

// * Types
interface iOTP {
  req: NextApiRequest;
  res: NextApiResponse;
  operation: "generate" | "validate";
  redisKey: "loginOtp" | "resetOtp" | string;
  phone: string;
}

export default async function OTP({
  req,
  res,
  operation,
  redisKey,
  phone,
}: iOTP) {
  const OTPs = await redis.keys(`${redisKey}: ${phone}: *`);

  if (operation === "generate") {
    // ? Check if OTPs in redis has reached max threshold for this phone
    if (OTPs.length >= process.env.MAX_OTPS_TO_SEND)
      errorHandler({
        req,
        res,
        subject: "Max OTPs sent!",
        err: {
          message: "Please enter the last OTP sent to your phone.",
        },
        file: "OTP.js",
        status: 401,
        sendToClient: true,
      });
    else
      try {
        // ? Generate an OTP
        const OTP = Number(Math.floor(1000 + Math.random() * 9000).toString());
        // ? Set the OTP in redis
        await redis.set(
          `${redisKey}: ${phone}: ${dayjs().unix()}`,
          OTP,
          "EX",
          process.env.OTP_EXPIRY
        );
        // ? Send SMS to phone
        sendSMS(req, res, phone, `Your One Time PIN (OTP) is ${OTP}`);
      } catch (err) {
        errorHandler({
          req,
          res,
          subject: "OTP not sent",
          err: { message: "OTP could not be sent to your phone." },
          file: "OTP.js",
          status: 503,
          sendToClient: true,
        });
      }
  } else if (operation === "validate")
    return await redis.get(OTPs.sort().reverse()[0]);
}
