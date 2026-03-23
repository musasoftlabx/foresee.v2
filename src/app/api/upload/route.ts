// * Node
import { unlinkSync, writeFileSync } from "fs";

// * Next
import { type NextRequest, NextResponse } from "next/server";

// * NPM
import { filesize } from "filesize";
import { fileTypeFromBlob } from "file-type";
import dayjs from "dayjs";
import ExcelJS, { type CellValue } from "@protobi/exceljs";
import mime from "mime";

// * Libs
import { prisma } from "@/lib/prisma";

// * Helpers
import { tempPath } from "@/helpers/configurePaths";

const MAX_FILE_SIZE: number = 5; //* 1024 * 1024;
const FILE_WHITELIST: string[] = [
  "png",
  "jpg",
  "pdf",
  "docx",
  "doc",
  "csv",
  "xls",
  "xlsx",
];
const SPREADSHEETS: string[] = ["csv", "xls", "xlsx"];

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const prefix = formData.get("prefix");
  const template = <string>formData.get("template");
  const file = formData
    .getAll("file")
    .filter((field) => typeof field === "object" && field)[0] as Blob | null;

  if (!file) {
    return NextResponse.json(
      { error: "File blob is required." },
      { status: 400 },
    );
  }

  // ? Ensure file does not surpass maximum size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        error: "File size exceeded!",
        message: `File should not be more than ${filesize(process.env.MAX_FILE_SIZE, { round: 0 })}`,
      },
      { status: 400 },
    );
  }

  // ? Ensure file is within the whitelisted files
  if (!FILE_WHITELIST.includes(mime.getExtension(file.type)!)) {
    return NextResponse.json(
      {
        error: "File not allowed!",
        message: `File of type ${file.type} cannot be processed.`,
      },
      { status: 400 },
    );
  }

  // ? Ensure file contents are of whitelisted files
  const verifyFileType = await fileTypeFromBlob(file);

  if (!FILE_WHITELIST.includes(verifyFileType?.ext!)) {
    return NextResponse.json(
      {
        error: "Invalid file!",
        message: `File is not a valid ${mime.getExtension(file.type)}.`,
      },
      { status: 400 },
    );
  }

  try {
    // ? Create filename
    const filename = `${prefix}.${dayjs().format(
      "YYYY.MM.DD-HH.mm.ss",
    )}.${mime.getExtension(file.type)}`;

    // ? Create path constant
    const path = `${tempPath}/${filename}`;

    // ? Write file to disk
    writeFileSync(path, Buffer.from(await file.arrayBuffer()));

    if (SPREADSHEETS.includes(verifyFileType?.ext!)) {
      const workbookReader: ExcelJS.stream.xlsx.WorkbookReader =
        new ExcelJS.stream.xlsx.WorkbookReader(path, {});

      let fields: CellValue[] | { [key: string]: CellValue } = [];
      let sheets: ExcelJS.WorksheetModel[] = [];

      for await (const worksheetReader of workbookReader) {
        sheets = workbookReader.model.sheets;

        for await (const row of worksheetReader) {
          if (row.number === 1) fields = row.values;
        }
      }

      return NextResponse.json(
        {
          filename,
          sheetFields: (fields as NonNullable<CellValue>[])
            .filter((field) => field) // ? Remove nulls
            .map((field, index) => ({
              field: typeof field === "object" ? `A${index + 1}` : field,
              mapsTo: "",
            })),
          sheets,
          systemFields: (
            await prisma.spreadsheetTemplates.findFirst({
              where: { template },
              select: { fields: true },
            })
          )?.fields,
        },
        { status: 201 },
      );
    } else return NextResponse.json({ filename }, { status: 201 }); // ? Send filename to client as identifier
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export function DELETE(req: NextRequest) {
  const file = req.nextUrl.searchParams.get("file");

  try {
    unlinkSync(`${tempPath}/${file}`);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        {
          error: "Deletion failure!",
          message: error.message ?? "File was not deleted!",
        },
        { status: 400 },
      );
  }
}

// const path = `${ballotsPath}/${context}`;// ? Define directory path
//     !existsSync(path) && mkdirSync(path, { recursive: true }); // ? Check if directory exists. If not, create it.
//     chmodSync(`${path}`, 0o777); // ? Change directory permissions
//renameSync(`${uploadDir}/${filename}`, `${path}/${filename}`); // ? Move file from temp folder to respective context definition.
