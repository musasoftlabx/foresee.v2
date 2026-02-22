import cron from "node-cron";
import got from "got";

export const dailyUserAuditReportCron = () =>
  cron.schedule("0 0,3,6 * * *", () =>
    got(`${process.env.NEXT_PUBLIC_API}dailyUserAuditReport`).then(() =>
      console.log(`File generated`)
    )
  );
