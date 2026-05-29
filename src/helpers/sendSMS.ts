// * Libs
// biome-ignore assist/source/organizeImports: <biome-ignore lint: false positive>
import { prisma } from "@/lib/prisma";

// * Helpers
import { redisCluster } from "./configureRedis";
import got from "got";

// * Types
import type { RedisConfigs } from "../../types";

type TSMSResponse = {
  responses: {
    "response-code": number;
    "response-description": string;
    mobile: number;
    messageid: number;
    networkid: number;
  }[];
};

export default async function SendSMS(phoneNumber: string, message: string) {
  const configs: RedisConfigs = await redisCluster("SMS");

  try {
    const { responses }: TSMSResponse = await got
      .post(configs.SMS_ENDPOINT, {
        https: { rejectUnauthorized: false },
        json: {
          apikey: configs.SMS_API_KEY,
          partnerID: configs.SMS_PARTNER_ID,
          shortcode: configs.SMS_SENDER_ID,
          message,
          mobile: phoneNumber,
        },
      })
      .json();

    if (responses[0]["response-code"] === 200) {
      await prisma.smsLogs.create({
        data: {
          receipients: [phoneNumber],
          message,
          response: {
            messageId: responses[0].messageid,
            networkId: responses[0].networkid,
          },
          isSent: true,
        },
      });
      return false;
    } else {
      await prisma.smsLogs.create({
        data: {
          receipients: [phoneNumber],
          message,
          response: responses,
          isSent: true,
        },
      });
      return "error";
    }
  } catch (error) {
    if (error instanceof Error)
      await prisma.smsLogs.create({
        data: {
          receipients: [phoneNumber],
          message,
          response: error.message,
        },
      });
  }
}
