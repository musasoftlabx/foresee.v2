// * Next
import type { NextApiResponse } from "next";

export default function composeURL(
  res: NextApiResponse,
  directory: string,
  filename: string
) {
  process.env.NODE_ENV === "development"
    ? res.send(
        `${process.env.NEXT_PUBLIC_API}_files/fs/temp/${directory}/${filename}`
      )
    : res.send(`${process.env.FS_URL}/temp/${directory}/${filename}`);
}
