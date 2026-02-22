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

export default async function sendSMS(
  req: NextApiRequest,
  res: NextApiResponse,
  phone: string,
  message: string
) {
  const configs: Configs = await getRedisConfigs("SMS");

  /**
   * TODO: Begin Functions
   */

  // ? Save error to DB
  const saveError = async (error: string) =>
    await DB.insert(`INSERT INTO dp_SMS_errors VALUES (NULL, ?, ?, ?, now())`, [
      phone,
      message,
      error,
    ]);

  // ? SMS sender function
  const send = async (token: string) => {
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
                  receiver: { id: [{ value: `254${phone.slice(1)}` }] },
                },
                parts: {
                  trailer: { text: configs.SENDER },
                  body: { text: message },
                },
              },
            ],
          },
          timeout: { request: configs.SMS_FALLBACK_TIMEOUT_IN_SECONDS * 1000 },
        })
        .json();

      if (JSON.stringify(data).includes("Records processed successfully")) {
        res.send("ok");
        return false;
      } else {
        saveError(JSON.stringify(data));
        return "error";
      }
    } catch (err: any) {
      saveError(JSON.stringify(err));
      return err?.message;
    }
  };

  /**
   * TODO: End Functions
   */

  if (
    phone.length === 10 &&
    (startsWith(phone, "07") || startsWith(phone, "01"))
  ) {
    // ? Check if token is cached in redis
    try {
      const cachedToken = await redis.get(`${process.env.NODE_ENV}SMStoken`);

      if (cachedToken) {
        const res = await send(cachedToken);
        if (typeof res === "string") throw new Error(`Send SMS Error: ${res}`);
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
          const res = await send(access_token);
          if (typeof res === "string")
            throw new Error(`Send SMS Error: ${res}`);
        } catch (err: any) {
          saveError(`Auth API Error: ${err?.message}`);
          throw new Error(`Auth API Error: ${err?.message}`);
        }
    } catch (err: any) {
      const error = err?.message ?? "An error occured. SMS could not be sent.";
      saveError(error);

      // ? Attempt to send SMS using alternate endpoint
      try {
        const data = await got
          .post(process.env.SMS_ENDPOINT, {
            headers: {
              "Content-Type": "text/xml",
              SoapAction:
                "/SharedResources/ConcreteWsdls/WSDL-service1.serviceagent/PortTypeEndpoint1/SAFService",
            },
            body: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:saf="http://safaricom.co.ke/Schemas/SAFService/">
                      <soapenv:Header/>
                      <soapenv:Body>
                        <saf:ServiceRequest>
                          <saf:Header>
                            <saf:RequestRefId>${dayjs().unix()}</saf:RequestRefId>
                            <saf:SourceSystem>lnm_app</saf:SourceSystem>
                            <saf:OperationName>SendSMS</saf:OperationName>
                            <saf:OperationVersion>1</saf:OperationVersion>
                            <saf:UserID>lnmuser</saf:UserID>
                          </saf:Header>
                          <saf:Body>
                            <SendSMSRequest xmlns="http://www.tibco.com/schemas/Safaricom_care_app/SharedResources/Schemas/Schema.xsd3">
                              <RecipientMSISDN>${phone}</RecipientMSISDN>
                              <SMSText>${message}</SMSText>
                            </SendSMSRequest>
                          </saf:Body>
                        </saf:ServiceRequest>
                      </soapenv:Body>
                    </soapenv:Envelope>`,
          })
          .text();

        const obj = new XMLParser({ removeNSPrefix: true }).parse(data);
        const responseCode =
          obj.Envelope.Body.ServiceResponse.ResponseHeader.ResponseCode;

        if (responseCode === 0)
          res.send(
            obj.Envelope.Body.ServiceResponse.ResponseHeader.ResponseMsg
          );
        else {
          res.status(400).json({ subject: "SMS not sent", body: error });
          saveError(
            obj.Envelope.Body.ServiceResponse.ResponseHeader.ResponseMsg
          );
        }
      } catch (err: any) {
        const error =
          err?.message ?? "An error occured. SMS could not be sent.";
        res.status(500).json({ subject: "SMS not sent", body: error });
        saveError(error);
      }
    }
  } else {
    res.status(400).json({
      subject: "SMS not sent.",
      body: "Incorrect phone number format!",
    });
    saveError("Incorrect phone format");
  }
}
