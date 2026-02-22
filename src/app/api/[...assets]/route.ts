// * Node
import fs from "fs";

// * Next
import { NextRequest, NextResponse } from "next/server";

// * NPM
import mime from "mime";

// * Helpers
import { cwd } from "../../../helpers/configurePaths";

export async function GET(req: NextRequest) {
  const filepath = req.nextUrl.pathname;
  const filenameArray = filepath.split("/");
  const filename = filenameArray[filenameArray.length - 1];
  const extension = filename?.split(".").pop();
  const path = `${cwd?.join("/")}/src/app${filepath}`;

  return new NextResponse(fs.readFileSync(path), {
    headers: { "Content-Type": `${mime.getType(extension!)}` },
  });
}
