// * NPM
import nodemailer from "nodemailer";

// * Helpers
import { DB } from "./DB.connect";
import getRedisConfigs from "./getRedisConfigs";

export default async function sendEmail({
  subject,
  receipients,
  text,
  html,
  sender,
}: {
  subject: string;
  receipients: string;
  text: string;
  html: string;
  attachments?: { filename: string; path: string; contentType?: string }[];
  sender: string;
}) {
  const configs: Configs = await getRedisConfigs("EMAIL");

  try {
    const transporter = nodemailer.createTransport({
      host: configs.HOST,
      port: Number(configs.PORT),
      secure: false,
      auth: { user: configs.AUTH_USER, pass: configs.AUTH_PASS },
    });

    const response = await transporter.sendMail({
      from: '"Dealer Portal" <dealerportal@safaricom.co.ke>',
      to: receipients,
      subject,
      text,
      html,
    });

    // ? Save response to DB
    await DB.insert(
      `INSERT INTO dp_email_attempts VALUES (NULL, ?, ?, ?, ?, ?, ?, now())`,
      [subject, receipients, html, 1, response, sender]
    );
  } catch (err: any) {
    // ? Save error to DB
    await DB.insert(
      `INSERT INTO dp_email_attempts VALUES (NULL, ?, ?, ?, ?, ?, ?, now())`,
      [subject, receipients, html, 0, err.message, sender]
    );
  }
}
