// * Server
// biome-ignore assist/source/organizeImports: <biome-ignore lint: false positive>
import { type NextRequest, NextResponse } from "next/server";

// * NPM
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import advancedFormat from "dayjs/plugin/advancedFormat";
import argon2 from "argon2";
import dayjs from "dayjs";

// * Helpers
import { dayjsDayFormatter } from "@/helpers/dayjsDayFormatter";
import SendSMS from "@/helpers/sendSMS";

// * Hooks
import QueryRefiner from "@/helpers/queryRefiner";

// * Libs
import { prisma } from "@/lib/prisma";

// * Types
import type { ByOn } from "@/types";
import getOrganizationId from "@/helpers/getOrganizationId";
import GeneratePassword from "@/helpers/generatePassword";

// * Extensions
dayjs.extend(advancedFormat);

const organizationId = 6;
const username = "mmuliro";
const model = "members";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { limit, offset, exportable, refines } = Object.fromEntries(
    searchParams.entries(),
  );

  const { query, searchResults, totalCount } = await QueryRefiner({
    where: { organizationId },
    limit,
    offset,
    refines,
    search: {
      model,
      fields: [
        "firstName",
        "lastName",
        "emailAddress",
        "phoneNumber",
        "added",
        "modified",
        "isActive",
      ],
    },
  });

  const rows =
    searchResults.length > 0
      ? searchResults
      : await prisma[model].findMany(query);

  const dataset = [];

  if (exportable) {
    return false;
  }

  for (const row of rows) {
    dataset.push({
      ...row,
      added: {
        ...row.added,
        on: dayjsDayFormatter(row.added.on),
      },
      modified: {
        ...row.modified,
        on: dayjsDayFormatter(row.modified.on),
      },
    });
  }

  return NextResponse.json({ dataset, filtered: dataset.length, totalCount });
}

export async function POST(request: Request) {
  const { firstName, lastName, phoneNumber, emailAddress, roles } =
    await request.json();

  //const organizationId = await getOrganizationId();

  const exists = await prisma[model].findFirst({
    where: { emailAddress, organizationId },
  });

  if (exists)
    return NextResponse.json(
      {
        icon: "",
        subject: "Member already exists!",
        body: "This member already exists in this organization.",
      },
      { status: 409 },
    );
  else {
    const password = GeneratePassword();
    await prisma[model].create({
      data: {
        organizationId,
        firstName,
        lastName,
        emailAddress,
        phoneNumber,
        password: await argon2.hash(password),
        roles,
        added: { by: username },
        modified: { by: username },
        activities: [{ activity: "Account created!", timestamp: new Date() }],
      },
    });

    //const sendSMS = false;

    const sendSMS = await SendSMS(
      phoneNumber.replace(/[^a-z0-9]/gi, ""),
      `Welcome aboard.\nYou have been added as a user under _. Your login credentials are as follows:\nEmail Address - ${emailAddress}\nPassword is ${password}\n Ensure you change this once logged in.`,
    );

    if (!sendSMS) {
      return NextResponse.json({}, { status: 201 });
    } else {
      return NextResponse.json({ error: sendSMS }, { status: 400 });
    }
  }
}

export async function PATCH(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { scope } = Object.fromEntries(searchParams.entries());

  if (scope === "editCell") {
    const { id, field, value } = await request.json();
    try {
      const {
        modified: { by, on },
      } = (await prisma[model].update({
        where: { id },
        data: { [field]: value, modified: { by: username, on: new Date() } },
        select: { modified: true },
      })) as unknown as { modified: ByOn };

      return NextResponse.json(
        { by, on: dayjsDayFormatter(on) },
        { status: 201 },
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return NextResponse.json(
          { icon: "", error: error.name, message: error.message },
          { status: 400 },
        );
      }
    }
  }
}

export async function DELETE(request: NextRequest) {
  const ids = await request.json();

  try {
    return NextResponse.json(
      await prisma[model].deleteMany({ where: { id: { in: ids } } }),
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        { icon: "", error: error.name, message: error.message },
        { status: 400 },
      );
    }
  }
}
