// * Server
import { type NextRequest, NextResponse } from "next/server";

// * NPM
import argon2 from "argon2";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import EmailTemplate from "./email-template";

// * Libs
import { prisma } from "@/lib/prisma";

// * Helpers
import { redis } from "@/helpers/configureRedis";
import sendMail from "@/helpers/sendEmail";
import GeneratePasscode from "@/helpers/generatePasscode";

// * Types
import type { GoogleOAuthToken } from "@/types";

const model = "users";

export async function POST(request: NextRequest) {
  const {
    type,
    token,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    password: encoded,
  } = await request.json();

  if (type === "google") {
    const { email, name, picture, given_name, family_name } = jwt.decode(
      token,
    ) as GoogleOAuthToken;

    // ? 💾 Save to DB
    const user = await prisma[model].create({
      data: {
        firstName: given_name ?? name.split(" ")[0],
        lastName: family_name ?? name.split(" ")[1],
        emailAddress: email,
        avatar: picture,
        roles: ["Admin"],
        added: { by: "system" },
        modified: { by: "system" },
        activities: [{ activity: "Account created!", timestamp: new Date() }],
      },
      select: {
        firstName: true,
        lastName: true,
        emailAddress: true,
        avatar: true,
        roles: true,
      },
    });

    // ? ⚙️ Generate token
    const accessToken = jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        roles: user.roles,
        avatar: user.avatar,
      },
      `{configs.ACCESS_TOKEN}`,
      { expiresIn: `60m` },
    );

    // ? 💾 Store the token in redis
    await redis.set(`logged-in-users: ${emailAddress}`, accessToken, "EX", 600);

    // ? 🎉 Send response back to client
    return NextResponse.json(
      { _foresee_aT: accessToken, sidebar: [] },
      { status: 201 },
    );
  }

  const userExists = await prisma[model].count({ where: { emailAddress } });

  if (userExists > 0)
    return NextResponse.json(
      { icon: "", error: "Duplicate found", message: "Duplicate found" },
      { status: 400 },
    );
  else {
    // ? Decode base64 password
    const password = Buffer.from(encoded, "base64").toString();

    try {
      // ? 🚧 Check password length
      if (password.length < process.env.NEXT_PUBLIC_MINIMUM_PASSWORD_LENGTH)
        throw Error(
          `Password has less than ${process.env.NEXT_PUBLIC_MINIMUM_PASSWORD_LENGTH} characters.`,
        );

      // ? 🚧 Check characters requirement
      if (
        !/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/.test(
          password,
        )
      )
        throw new Error(
          `Password should contain at least ${process.env.NEXT_PUBLIC_MINIMUM_PASSWORD_LENGTH} characters, 1 number, 1 uppercase, 1 lowercase and 1 special character.`,
        );

      // ? 🕒 Check if password has more than 3 sequential identical characters
      if (/(.)\1{3}/.test(password))
        throw new Error("Password has 3 sequential identical characters.");

      // ? 📨 Check if password contains email address
      if (password.includes(emailAddress.split("@")[0]))
        throw new Error("Email address included in password.");

      // ? ⚙️ Generate a passcode for email verification
      const passcode = GeneratePasscode();

      // ? 💾 Store the passcode in redis
      await redis.set(
        `emailPasscode: ${phoneNumber}: ${dayjs().unix()}`,
        passcode,
        "EX",
        process.env.PASSCODE_EXPIRY,
      );

      // ? 📨 Send the passcode via email
      sendMail({
        subject: "Welcome to Foresee!",
        receipients: [emailAddress],
        text: "Welcome to Foresee! Your account has been successfully created.",
        html: `<div style="font-family:'Trebuchet MS'; font-size: 13px;">Greetings Musa,
                <br/>
                <br/>
                Your account has been successfully created. Use the code below to verify your email address and activate your account. Kindly note that the code expires in 10 minutes.
                <br/>
                <b>${passcode}</b>
                <br/>
                Best Regards,
                <br/>
                Foresee Management.
              </div>
            `,
      });

      // ? 🎉 Send response back to client
      return NextResponse.json(
        await prisma[model].create({
          data: {
            firstName,
            lastName,
            emailAddress,
            phoneNumber,
            password: await argon2.hash(password),
            passcode,
            roles: ["Admin"],
            added: { by: "system" },
            modified: { by: "system" },
            activities: [
              { activity: "Account created!", timestamp: new Date() },
            ],
          },
          select: {
            firstName: true,
            lastName: true,
            emailAddress: true,
            phoneNumber: true,
          },
        }),
        { status: 201 },
      );
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { icon: "", error: error.name, message: error.message },
          { status: 400 },
        );
      }
    }
  }
}
