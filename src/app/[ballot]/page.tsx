import { headers } from "next/headers";

//import { ballotsCollection } from "@/db/schema";

import Client from "./client";
import Error from "./error";

export default async function SignIn() {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  const ballot = pathname?.split("/")[1];

  // try {
  //   const _ = await ballotsCollection.findOne({ ballot });
  //   const ballotDetails = JSON.parse(JSON.stringify(_));

  //   if (!ballotDetails) throw "Ballot not found";

  //   return <Client>{ballotDetails}</Client>;
  // } catch (message: any) {
  //   return <Error message={message} />;
  // }
}
