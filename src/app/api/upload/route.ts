// * Node
import { unlinkSync, writeFileSync } from "fs";

// * Next
import { NextRequest, NextResponse } from "next/server";

// * NPM
import { filesize } from "filesize";
import { fileTypeFromBlob } from "file-type";
import dayjs from "dayjs";
import mime from "mime";

// * Helpers
import { tempPath } from "@/helpers/configurePaths";

const MAX_FILE_SIZE: number = 5 * 1024 * 1024;
const FILE_WHITELIST: string[] = [
  "png",
  "jpg",
  "gif",
  "pdf",
  "docx",
  "xlsx",
  "doc",
  "xls",
];

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const prefix = formData.get("prefix");
  const file = formData
    .getAll("file")
    .filter((field) => typeof field === "object" && field)[0] as Blob | null;

  if (!file) {
    return NextResponse.json(
      { error: "File blob is required." },
      { status: 400 }
    );
  }

  // ? Ensure file does not surpass maximum size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        error: "File size exceeded!",
        message: `File should not be more than ${filesize(process.env.MAX_FILE_SIZE, { round: 0 })}`,
      },
      { status: 400 }
    );
  }

  // ? Ensure file is within the whitelisted files
  if (!FILE_WHITELIST.includes(mime.getExtension(file.type)!)) {
    return NextResponse.json(
      {
        error: "File not allowed!",
        message: `File of type ${file.type} cannot be processed.`,
      },
      { status: 400 }
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
      { status: 400 }
    );
  }

  try {
    // ? Create filename
    const filename = `${prefix}.${dayjs().format(
      "YYYY.MM.DD-HH.mm.ss"
    )}.${mime.getExtension(file.type)}`;

    // ? Write file to disk
    writeFileSync(
      `${tempPath}/${filename}`,
      Buffer.from(await file.arrayBuffer())
    );

    // ? Send filename to client as identifier
    return new NextResponse(filename, { status: 201 });
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
      return Response.json(
        {
          error: "Deletion failure!",
          message: error.message ?? "File was not deleted!",
        },
        { status: 400 }
      );
  }
}

// const path = `${ballotsPath}/${context}`;// ? Define directory path
//     !existsSync(path) && mkdirSync(path, { recursive: true }); // ? Check if directory exists. If not, create it.
//     chmodSync(`${path}`, 0o777); // ? Change directory permissions
//renameSync(`${uploadDir}/${filename}`, `${path}/${filename}`); // ? Move file from temp folder to respective context definition.
