// * NPM
import {
  initOracleClient,
  getConnection,
  OUT_FORMAT_OBJECT,
  OUT_FORMAT_ARRAY,
} from "oracledb";
import got from "got";

// * Helpers
import getRedisConfigs from "./getRedisConfigs";
// Links - https://www.oracle.com/database/technologies/instant-client/linux-x86-64-downloads.html
// Download link - https://download.oracle.com/otn_software/linux/instantclient/2113000/instantclient-basic-linux.x64-21.13.0.0.0dbru.zip

export default async function oracleCI({
  query,
  maxRows,
  returnObj,
}: {
  query: string;
  maxRows?: number;
  returnObj?: boolean;
}) {
  if (process.env.NODE_ENV === "development") {
    const data: { BAL: string } = await got
      .post("https://172.29.127.13/api/oracle", {
        https: { rejectUnauthorized: false },
        json: { query, returnObj },
      })
      .json();
    return data;
  } else if (process.env.NODE_ENV === "production") {
    initOracleClient({ libDir: "/usr/lib/oracle/21/client64/lib/" });

    const configs: Configs = await getRedisConfigs("ERP");

    const connection = await getConnection({
      user: configs.ORACLE_ERP_DB_USER,
      password: configs.ORACLE_ERP_DB_PASSWORD,
      connectString: configs.ORACLE_ERP_DB_CONNECTION_STRING,
    });

    try {
      const result = await connection.execute(query, [], {
        maxRows: maxRows ? maxRows : 0,
        extendedMetaData: true,
        outFormat: returnObj ? OUT_FORMAT_OBJECT : OUT_FORMAT_ARRAY,
      });
      return result.rows;
    } catch (err: any) {
      return { subject: "DB Error", body: err?.message };
    }
  }
}
