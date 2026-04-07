// * Server
import { type NextRequest, NextResponse } from "next/server";

// * NPM
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";

// * Libs
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

// * Helpers
import { redis, redisCluster } from "@/helpers/configureRedis";
import clientDetails from "@/helpers/clientDetails";

// * Types
import type { GoogleOAuthToken } from "@/types";

// * Extensions
dayjs.extend(advancedFormat);

const configs: RedisConfigs = await redisCluster("DB");

export async function POST(request: NextRequest) {
  const { type, token, emailAddress, password: encoded } = await request.json();

  //return NextResponse.json(clientDetails(request).device, { status: 200 });

  if (type === "google") {
    const { email } = jwt.decode(token) as GoogleOAuthToken;

    const user = await prisma.users.findUnique({
      where: { emailAddress: email },
    });

    if (user) {
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
        { expiresIn: `10m` },
      );

      // ? 💾 Save to logins table
      await prisma.logins.create({
        data: {
          emailAddress: user.emailAddress,
          ip: clientDetails(request).ip,
          client: clientDetails(request).client as unknown as Prisma.JsonObject,
          device: clientDetails(request).device,
        },
      });

      // ? 💾 Update activity logs
      await prisma.users.update({
        where: { emailAddress: email },
        data: {
          activities: [
            ...(user.activities as string[]),
            { activity: "Logged In", timestamp: new Date() },
          ],
        },
      });

      // ? 💾 Store the user in redis
      await redis.set(`logged-in-users: ${email}`, accessToken, "EX", 600);

      return NextResponse.json({ _foresee_aT: accessToken }, { status: 201 });
    } else {
      return NextResponse.json(
        {
          icon: "",
          subject: "User not found!",
          body: "The user provided does not exist.",
        },
        { status: 404 },
      );
    }
  }

  if (emailAddress && encoded) {
    const password = encoded;

    const user = await prisma.users.findUnique({
      where: { emailAddress, password },
    });

    if (user) {
      // ? Decode base64 password
      const password = Buffer.from(encoded, "base64").toString();

      const toSign = {
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        roles: user.roles,
      };

      const accessToken = jwt.sign(toSign, `${configs.ACCESS_TOKEN}`, {
        expiresIn: `${configs.ACCESS_TOKEN_EXPIRY_IN_MINUTES}m`,
      });

      await prisma.logins.create({
        data: {
          emailAddress,
          ip: clientDetails(request).clientIp,
          device: {
            type: clientDetails(request).clientInfo.device.type,
            brand: clientDetails(request).clientInfo.device.brand,
            model: clientDetails(request).clientInfo.device.model,
          },
          client: {
            type: clientDetails(request).clientInfo.client.type,
            name: clientDetails(request).clientInfo.client.name,
            version: clientDetails(request).clientInfo.client.version,
          },
          os: {
            name: clientDetails(request).clientInfo.os.name,
            version: clientDetails(request).clientInfo.os.version,
          },
        },
      });

      await redis.set(
        `loggedIn: ${emailAddress}`,
        accessToken,
        "EX",
        parseInt(configs.ACCESS_TOKEN_EXPIRY_IN_MINUTES) * 60,
      );

      return NextResponse.json({ _foresee_aT: accessToken }, { status: 201 });
    } else {
      return NextResponse.json(
        {
          icon: "",
          error: "User not found!",
          message: "The user provided does not exist.",
        },
        { status: 404 },
      );
    }
  } else {
    return NextResponse.json(
      {
        icon: "",
        error: "Username or password not provided.",
        message: "Missing details",
      },
      { status: 400 },
    );
  }
}
