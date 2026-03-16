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

const username = "mmuliro";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const { limit, offset, exportable, refines, store } = Object.fromEntries(
    searchParams.entries(),
  );

  const { query, searchResults } = await useQueryRefiner({
    where: { storeId: Number(store) },
    limit,
    offset,
    refines,
    search: {
      table: "Audits",
      fields: ["code", "barcode", "date", "created", "modified"],
    },
  });

  const rows =
    searchResults.length > 0
      ? searchResults
      : await prisma.audits.findMany(query);

  const dataset = [];

  if (exportable) {
    return false;
  }

  for (const row of rows) {
    dataset.push({
      ...row,
      locations: await prisma.locations.count({ where: { auditId: row.id } }),
      scans: await prisma.scans.count({ where: { auditId: row.id } }),
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
    store,
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
  const storeId = Number(store);

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

      // ? Create inventory records based on the created store
      await prisma.$transaction(
        inventory.map((item: { barcode?: string }) => {
          const { barcode, ...attributes } = item;
          return prisma.inventory.createMany({
            data: {
              storeId,
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
      const { code: storeCode } = <{ code: string }>(
        await prisma.stores.findFirst({
          where: { id: storeId },
          select: { code: true },
        })
      );

      // ? Get number of audits
      const auditCount = await prisma.audits.count({ where: { storeId } });

      // ? If no audits, skip to 1 to start store count at 1
      const auditPadding = auditCount === 0 ? 1 : auditCount + 1;

      // ? Create an audit based on the created store
      const createdAudit = await prisma.audits.create({
        data: {
          storeId,
          code: `ADT${padStart(auditPadding.toString(), 5, "0")}`, // ? Add padding to audit count if less than 5 characters
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
          code: `L${padStart((i + 1).toString(), 4, "0")}-${storeCode}-${dayjs(date).format("YYYYMMDD")}`,
          created: { by: username, on: new Date() },
          modified: { by: username, on: new Date() },
        })),
      });

      return NextResponse.json(createdAudit, { status: 201 });
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
        await prisma.audits.update({
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
      await prisma.audits.deleteMany({ where: { id: { in: ids } } }),
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
