// * Next
import type { NextApiRequest, NextApiResponse } from "next";

// * Node
import { existsSync, chmodSync, mkdirSync, writeFileSync } from "fs";

// * Helpers
import { tempPath } from "./configurePaths";
import composeURL from "./composeURL";
import errorHandler from "./errorHandler";

export default async function FileWriter(
  req: NextApiRequest,
  res: NextApiResponse,
  directory: string,
  filename: string,
  pdfBuffer: NodeJS.ArrayBufferView
) {
  try {
    // ? Init the directory to place the file
    const dir = `${tempPath}/${directory}`;

    // ? Check if directory exists. If not, create it.
    !existsSync(dir) && mkdirSync(dir, { recursive: true });

    // ? Change permissions for directory
    chmodSync(dir, 0o777);

    // ? Write file
    writeFileSync(`${dir}/${filename}`, pdfBuffer);

    // ? Change permissions for file
    chmodSync(`${dir}/${filename}`, 0o777);

    composeURL(res, directory, filename);
  } catch (err: any) {
    errorHandler({
      req,
      res,
      err,
      subject: "Server error!",
      sendToClient: true,
    });
  }
}
