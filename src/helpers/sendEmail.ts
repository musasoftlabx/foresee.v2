// * NPM
import nodemailer, { type SentMessageInfo } from "nodemailer";
//import type SMTPTransport from "nodemailer/lib/smtp-transport";

// * Libs
import { prisma } from "@/lib/prisma";

// * Helpers
//import getRedisConfigs from "./getRedisConfigs";

export default async function SendEmail({
  subject,
  receipients,
  text,
  html,
  attachments,
}: {
  subject: string;
  receipients: string[];
  text: string;
  html: string;
  attachments?: { filename: string; path: string; contentType?: string }[];
}) {
  //const configs: Configs = await getRedisConfigs("EMAIL");

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: { user: "info@4c.co.ke", pass: "@Info2025." },
      // host: configs.HOST,
      // port: Number(configs.PORT),
      // secure: true,
      // auth: { user: configs.AUTH_USER, pass: configs.AUTH_PASS },
    });

    const response: SentMessageInfo = await transporter.sendMail({
      from: '"Foresee Inc." <info@4c.co.ke>',
      to: receipients,
      subject,
      text,
      html,
      attachments,
    });

    await prisma.mailLogs.create({
      data: {
        receipients,
        subject,
        content: html,
        response: JSON.stringify(response),
        isSent: true,
      },
    });
  } catch (error) {
    if (error instanceof Error)
      await prisma.mailLogs.create({
        data: {
          receipients,
          subject,
          content: html,
          response: JSON.stringify(error),
        },
      });
  }
}
