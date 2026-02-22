// * Next
import type { NextApiRequest, NextApiResponse } from "next";

// * NPM
import { XMLParser } from "fast-xml-parser";
import axios from "axios";

// * Helpers
import { DB } from "./DB.connect";
import { iJWTdata, verifyJWT } from "./signVerifyJWT";
import getRedisConfigs from "./getRedisConfigs";
import oracleCI from "./oracleCI";

export default async function fetchBalances(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { dealerCode } = <iJWTdata>await verifyJWT(req);

  const configs: Configs = await getRedisConfigs("SOA");

  const save = async (
    balance: string | null,
    channel: string,
    responseError: string | null
  ) => {
    await DB.insert(
      `INSERT INTO dp_balances
       VALUES (NULL, ?, ?, ?, ?, now())`,
      [dealerCode, balance, channel, responseError]
    );
  };

  let balances = {
    balance: null,
    uncleared: null,
    available: null,
    invoice: null,
  };

  try {
    const balance: any = await oracleCI({
      query: `SELECT xxsfc_dealer_erp_balance('${dealerCode}')bal FROM dual`,
      returnObj: true,
    });

    const invoice: any = await oracleCI({
      query: `SELECT
                interface_header_attribute2 order_type,
                SUM(a.amount_due_remaining)total_amt
              FROM
                ar_payment_schedules_all a,
                ra_customer_trx_all      b,
                ar_customers             c
              WHERE trunc(a.due_date) > trunc(sysdate)
              AND a.customer_trx_id = b.customer_trx_id
              AND a.class = 'INV'
              AND a.status = 'OP'
              AND c.customer_id = b.sold_to_customer_id
              AND c.customer_number = '${dealerCode}'
              GROUP BY interface_header_attribute2`,
      returnObj: true,
    });

    balances = {
      ...balances,
      balance: balance[0].BAL.toLocaleString("en-US", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
      available: balance[0].BAL,
      invoice: invoice[0].TOTAL_AMT,
    };
    save(balances.balance, "OCI", null);
    return balances;
  } catch (err: any) {
    save(balances.balance, "OCI", err.message);

    try {
      const { data } = await axios.post(
        `${configs.ERP_SOA_OSB_IP}/osb/GetDealerUnclearedEffectsRequesterDealerPortal/ProxyServices/GetDealerUnclearedEffectsRequesterPS`,
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:get="http://www.safaricom.co.ke/Schemas/CRM/DMS/GetDealerUnclearedEffects/">
          <soapenv:Header/>
          <soapenv:Body>
            <get:Request>
              <get:DealerCode>${dealerCode}</get:DealerCode>
            </get:Request>
          </soapenv:Body>
        </soapenv:Envelope>`,
        {
          headers: {
            "Content-Type": "text/xml",
            SoapAction:
              "/SharedResources/Services/DMS_WSDL-service4.serviceagent/DMSEndpoint4/GetDealerUnclearedEffects",
          },
          timeout: 30000,
        }
      );

      const obj = new XMLParser({ removeNSPrefix: true }).parse(data);

      const responseCode = obj.Envelope.Body.Response.Header.RespCode;

      if (!responseCode) {
        const balancesObj =
          obj.Envelope.Body.Response.Message.Resultsets.ResultSet
            .UnclearedEffectsRecord;

        balances = {
          balance: balancesObj.ACCOUNT_BALANCE,
          uncleared: balancesObj.UNCLEARED_EFFECTS,
          available: balancesObj.AVAILABLE_BALANCE,
          invoice: null,
        };
      }

      save(balances.balance, "SOA", null);
      return balances;
    } catch (err: any) {
      save(balances.balance, "SOA", err.message);
      return balances;
    }
  }
}
