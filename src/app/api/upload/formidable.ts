// * NPM
import got from "got";

// * Node
import {
  chmodSync,
  existsSync,
  mkdirSync,
  renameSync,
  unlinkSync,
  statSync,
  writeFileSync,
} from "fs";

// * NPM
import dayjs from "dayjs";
import formidable, { errors as formidableErrors } from "formidable";
import { join } from "path";

// * Helpers
import { NextRequest, NextResponse } from "next/server";
import { ballotsPath, tempPath } from "@/helpers/configurePaths";
import next from "next";
import mime from "mime";
//import { iQueryOptions } from "../../../../types";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("blob") as Blob | null;
  const alias = formData.get("alias");
  const context = formData.get("context");

  if (!file) {
    return NextResponse.json(
      { error: "File blob is required." },
      { status: 400 }
    );
  }

  // ? Define upload directory
  const uploadDir = `${tempPath}/UploadDir`;
  // ? Check if directory exists. If not, create it.
  !existsSync(uploadDir) && mkdirSync(uploadDir, { recursive: true });
  // ? Change file permissions
  chmodSync(uploadDir, 0o777);

  const buffer = Buffer.from(await file.arrayBuffer());

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
    maxTotalFileSize: 20 * 1024 * 1024,
    filter: ({ mimetype }) =>
      mimetype ? mimetype.includes("image") || mimetype.includes("pdf") : false,
  });

  form.parse(await req.json(), (err, fields, files) => {
    console.log("fields", fields);
    console.log("files", files);
    try {
      const { alias, context } = fields;

      if (err) {
        next(err);
        return;
      }
      // ? Define directory path
      const path = `${ballotsPath}/${context}`;
      // ? Create filename
      const filename = `${alias}-${dayjs().format(
        "YYYY.MM.DD-HH.mm.ss"
      )}.${files.file?.newFilename.split(".").pop().toLowerCase()}`;
      // ? Check if directory exists. If not, create it.
      !existsSync(path) && mkdirSync(path, { recursive: true });
      // ? Change directory permissions
      chmodSync(`${path}`, 0o777);
      chmodSync(`${uploadDir}/${files.file?.newFilename}`, 0o777);
      // ? Move file from temp folder to respective context definition.
      renameSync(
        `${uploadDir}/${files.file?.newFilename}`,
        `${path}/${filename}`
      );
      // ? Send response to client.
      NextResponse.json(filename, { status: 201 });
    } catch (error) {
      if (error instanceof Error)
        return Response.json(
          {
            subject: "Upload error!",
            body:
              error.message ??
              "An error occurred while attempting to upload the file",
          },
          { status: 500 }
        );
    }
  });

  return NextResponse.json({ body }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const context = req.nextUrl.searchParams.get("context");
  const file = req.nextUrl.searchParams.get("file");

  try {
    unlinkSync(`${context}/${file}`);
    return NextResponse.json("Deleted!", { status: 204 });
  } catch (error) {
    if (error instanceof Error)
      return Response.json(
        {
          subject: "Deletion failure!",
          body: error.message ?? "File was not deleted!",
        },
        { status: 500 }
      );
  }
}
