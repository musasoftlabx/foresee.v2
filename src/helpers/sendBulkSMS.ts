// * Next
import type { NextApiRequest, NextApiResponse } from "next";

// * NPM
import { XMLParser } from "fast-xml-parser";
import dayjs from "dayjs";
import got from "got";
import startsWith from "lodash/startsWith";

// * Helpers
import { DB, redis } from "./DB.connect";
import getRedisConfigs from "./getRedisConfigs";

type Token = {
  access_token: string;
  refresh_token: string;
  expires_in: string;
  refresh_expires_in: string;
  token_type: string;
};

export default async function sendBulkSMS(
  req: NextApiRequest,
  res: NextApiResponse,
  phoneNumbers: string[],
  message: string
) {
  const configs: Configs = await getRedisConfigs("SMS");

  /**
   * TODO: Begin Functions
   */

  // ? SMS sender function
  const send = async (token: string, phoneNumber: string) => {
    // ? Send SMS
    try {
      const data = await got
        .post(configs.ENDPOINT, {
          headers: { Authorization: `Bearer ${token}` },
          https: { rejectUnauthorized: false },
          json: {
            request: [
              {
                roles: {
                  receiver: { id: [{ value: `254${phoneNumber.slice(1)}` }] },
                },
                parts: {
                  trailer: { text: configs.SENDER },
                  body: { text: message },
                },
              },
            ],
          },
          timeout: { request: 30000 },
        })
        .json();

      if (JSON.stringify(data).includes("Records processed successfully")) {
        res.send("ok");
        return false;
      } else {
        return "error";
      }
    } catch (err: any) {
      return err?.message;
    }
  };

  /**
   * TODO: End Functions
   */

  for (const phoneNumber of phoneNumbers) {
    if (
      phoneNumber.length === 10 &&
      (startsWith(phoneNumber, "07") || startsWith(phoneNumber, "01"))
    ) {
      // ? Check if token is cached in redis
      try {
        const cachedToken = await redis.get(`${process.env.NODE_ENV}SMStoken`);

        if (cachedToken) {
          const res = await send(cachedToken, phoneNumber);
          if (typeof res === "string")
            throw new Error(`Send SMS Error: ${res}`);
        } else
          try {
            // ? Invoke authorization API to receive token
            const { access_token, expires_in }: Token = await got
              .post(configs.AUTH_ENDPOINT, {
                username: configs.AUTH_USERNAME,
                password: configs.AUTH_PASSWORD,
                https: { rejectUnauthorized: false },
                json: {
                  realm: configs.REALM,
                  client_id: configs.CLIENT_ID,
                  username: configs.USERNAME,
                  password: configs.PASSWORD,
                },
              })
              .json();

            // ? Save token to redis and set to expire within the response time.
            await redis.set(
              `${process.env.NODE_ENV}SMStoken`,
              access_token,
              "EX",
              Number(expires_in)
            );

            // ? Send the SMS
            const res = await send(access_token, phoneNumber);
            if (typeof res === "string")
              throw new Error(`Send SMS Error: ${res}`);
          } catch (err: any) {
            throw new Error(`Auth API Error: ${err?.message}`);
          }
      } catch (err: any) {
        const error =
          err?.message ?? "An error occured. SMS could not be sent.";
      }
    } else {
      res.status(400).json({
        subject: "SMS not sent.",
        body: "Incorrect phone number format!",
      });
      return;
    }
  }
}
