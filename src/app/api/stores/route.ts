// * Server
import { NextRequest, NextResponse } from "next/server";

// * Node
import { existsSync } from "fs";

// * NPM
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";
import ExcelJS, { CellValue } from "@protobi/exceljs";
import padStart from "lodash/padStart";

// * Hooks
import { useDayjsDayFormatter } from "@/hooks/useDayjsDayFormatter";
import useQueryRefiner from "@/hooks/useQueryRefiner";

// * Libs
import { prisma } from "@/lib/prisma";

// * Helpers
import { tempPath } from "@/helpers/configurePaths";

// * Types
import { Created, Modified } from "@/types";

// * Extensions
dayjs.extend(advancedFormat);

const organizationId = 1;
const username = "mmuliro";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const { limit, offset, exportable, refines } = Object.fromEntries(
    searchParams.entries(),
  );

  const query = await useQueryRefiner({
    where: { organizationId },
    limit,
    offset,
    refines,
  });

  //console.log(query);

  const dataset = [];

  if (exportable) {
    return false;
  }

  for (const row of await prisma.stores.findMany(query)) {
    dataset.push({
      ...row,
      inventoryCount: await prisma.inventory.count({
        where: { storeId: row.id },
      }),
      created: {
        ...(row.created as unknown as Created),
        on: useDayjsDayFormatter((row.created as any).on),
      },
      modified: {
        ...(row.modified as unknown as Modified),
        on: useDayjsDayFormatter((row.modified as any).on),
      },
    });
  }

  return NextResponse.json({ count: dataset.length, dataset });
}

export async function POST(request: Request) {
  const {
    name,
    country: { code, name: country },
    client,
    inventory: {
      file: { filename, sheetFields },
    },
    audit: {
      date,
      barcode: { mode, characters },
      locations,
    },
  } = await request.json();

  const path = `${tempPath}/${filename}`;

  try {
    if (existsSync(path)) {
      const workbookReader: ExcelJS.stream.xlsx.WorkbookReader =
        new ExcelJS.stream.xlsx.WorkbookReader(path, {});

      let inventory = [];

      const fields = [
        "", // ? Included to align to excel's initial empty row cell
        ...sheetFields.map(({ mapsTo }: { mapsTo: string }) => mapsTo),
      ];

      // ? Read through the workbook rows and map them to an object based on the fields from the request body. Then, push the mapped objects to an inventory array.
      for await (const worksheetReader of workbookReader) {
        if ((worksheetReader as any).id === 1) {
          for await (const row of worksheetReader) {
            if (row.number > 1) {
              let obj: { [key: string]: CellValue } = {};
              (row.values as CellValue[]).forEach(
                (cell: CellValue, i: number) => (obj[fields[i]] = cell),
              );
              inventory.push(obj);
            }
          }
        }
      }

      // ? Insert only if the incoming client doesn't exists. Else, ignore, don't update
      await prisma.clients.upsert({
        where: { id: 1, organizationId, name: client },
        update: {},
        create: {
          organizationId,
          name: client,
          added: { by: username, on: new Date() },
          modified: { by: username, on: new Date() },
        },
      });

      // ? Get number of stores with similar country codes
      const storeCount = await prisma.stores.count({
        where: { organizationId, code: { startsWith: code } },
      });

      // ? If no stores, skip to 1 to start store count at 1
      const storePadding = storeCount === 0 ? 1 : storeCount + 1;

      // ? Add padding to store count if less than 2 characters
      const storeCode = `${code}${padStart(storePadding.toString(), 2, "0")}`;

      // ? Create the store
      const createdStore = await prisma.stores.create({
        data: {
          organizationId,
          code: storeCode,
          name,
          country,
          client,
          created: { by: username, on: new Date() },
          modified: { by: username, on: new Date() },
        },
      });

      // ? Create inventory records based on the created store
      const createInventory = await prisma.$transaction(
        inventory.map((item: { barcode?: string }) => {
          const { barcode, ...attributes } = item;
          return prisma.inventory.createMany({
            data: {
              storeId: createdStore.id,
              barcode: item.barcode!,
              attributes,
              added: { by: username, on: new Date() },
              modified: { by: username, on: new Date() },
            },
            skipDuplicates: true,
          });
        }),
      );

      // ? Get number of audits
      //const auditCount = await prisma.audits.count({ where: { storeId } });

      // ? If no audits, skip to 1 to start store count at 1
      //const auditPadding = auditCount === 0 ? 1 : auditCount + 1;

      // ? Add padding to audit count if less than 5 characters
      //const auditCode = `ADT${padStart(auditPadding.toString(), 5, "0")}`;

      // ? Create an audit based on the created store
      const createdAudit = await prisma.audits.create({
        data: {
          storeId: createdStore.id,
          code: `ADT${padStart("1", 5, "0")}`,
          date: new Date(date),
          barcode: { mode, characters: mode === "strict" ? characters[0] : 0 },
          created: { by: username, on: new Date() },
          modified: { by: username, on: new Date() },
        },
      });

      // ? Create locations for the audit based on the created store
      await prisma.locations.createMany({
        data: Array.from({ length: locations }).map((_, i) => ({
          auditId: createdAudit.id,
          code: `L${padStart((i + 1).toString(), 4, "0")}-${createdStore.code}-${dayjs(date).format("YYYYMMDD")}`,
          created: { by: username, on: new Date() },
          modified: { by: username, on: new Date() },
        })),
      });

      return NextResponse.json(createdStore, { status: 201 });
    } else throw new Error("File doesn't exist");
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      // ? Unique constraint failed
      if (error.code === "P2002") {
        return NextResponse.json(
          { icon: "", error: error.name, message: error.message },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { icon: "", error: error.name, message: error.message },
        { status: 400 },
      );
    }
  }
}

export async function PATCH(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { scope } = Object.fromEntries(searchParams.entries());

  if (scope === "editCell") {
    const { id, field, value } = await request.json();
    try {
      return NextResponse.json(
        await prisma.stores.update({
          where: { id },
          data: { [field]: value, modified: { by: username, on: new Date() } },
        }),
        { status: 201 },
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // logIt({code: 1, error: error.name, message: error.message})
        return NextResponse.json(
          { icon: "", error: error.name, message: error.message },
          { status: 400 },
        );
      }
    }
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  return NextResponse.json(body, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { ids } = await request.json();

  try {
    return NextResponse.json(
      await prisma.stores.deleteMany({ where: { id: { in: ids } } }),
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
