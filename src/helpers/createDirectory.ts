// * Next
import type { NextApiRequest, NextApiResponse } from "next";

// * Node
import { existsSync, chmodSync, mkdirSync } from "fs";

// * Helpers
import { tempPath } from "./configurePaths";
import errorHandler from "./errorHandler";

export default async function FileWriter(
  req: NextApiRequest,
  res: NextApiResponse,
  directory: string
) {
  try {
    // ? Init the directory to place the file
    const dir = `${tempPath}/${directory}`;

    // ? Check if directory exists. If not, create it and change permissions for directory
    !existsSync(dir) &&
      mkdirSync(dir, { recursive: true }) &&
      chmodSync(dir, 0o777);
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
