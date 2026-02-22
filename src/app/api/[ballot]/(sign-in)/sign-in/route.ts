// * NPM
import got from "got";

// * Helpers
import proxy from "@/helpers/effectProxy";
import { NextRequest } from "next/server";
import { clientsCollection, clientsSchema } from "@/db/schema";
import { Ballot, Voter } from "../../../../../../types";
import redis from "@/db/redisDB";

type Users = {}[];

/* {
  limit: '20',
  offset: '0',
  view: 'display',
  options: '{"sortModel":[{"field":"id","sort":"desc"}]}',
  scope: 'users'
} */

type SearchParams = {
  limit: string;
  offset: string;
  view: "display" | "export";
  options: string;
  scope: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const searchParams = req.nextUrl.searchParams;
  const { view } = <SearchParams>Object.fromEntries(searchParams.entries());

  //await redis.set(`test:`, "test", "EX", 60);

  return Response.json(redis);

  // const toSign = {
  //   username,
  //   firstName: user.firstName,
  //   middleName: user.middleName,
  //   lastName: user.lastName,
  // };

  // const accessToken = JWT.sign(toSign, `${configs.ACCESS_TOKEN}`, {
  //   expiresIn: `${configs.ACCESS_TOKEN_EXPIRY_IN_MINUTES}m`,
  // });

  // await DB.insert(
  //   `INSERT INTO dp_logins
  //       VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())`,
  //   [
  //     user.dealerCode,
  //     username,
  //     clientDetails(req).clientIp,
  //     clientDetails(req).clientInfo.device.type,
  //     clientDetails(req).clientInfo.device.brand,
  //     clientDetails(req).clientInfo.device.model,
  //     clientDetails(req).clientInfo.client.type,
  //     clientDetails(req).clientInfo.client.name,
  //     clientDetails(req).clientInfo.client.version,
  //     clientDetails(req).clientInfo.os.name,
  //     clientDetails(req).clientInfo.os.version,
  //   ]
  // );

  // // ? Delete username from failed logins table to prevent error message.
  // await DB.delete(`DELETE FROM dp_failed_logins WHERE username = ?`, [
  //   username,
  // ]);

  // await redis.set(
  //   `loggedIn: ${username}`,
  //   accessToken,
  //   "EX",
  //   parseInt(configs.ACCESS_TOKEN_EXPIRY_IN_MINUTES) * 60
  // );

  // res.json({
  //   __dp_dealers_aT: accessToken,
  //   __meta: {
  //     drawerItems: await navigationDrawer(user.DealerCode),
  //   },
  // });

  // const dataset: Users = await got(
  //   "https://650d8d1aa8b42265ec2c60ae.mockapi.io/users",
  //   proxy()
  // ).json();

  // if (view === "display")
  //   return Response.json({ count: dataset.length, dataset });

  // if (view === "export")
  //   return Response.json({ count: dataset.length, dataset });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ ballot: string }> },
) {
  const ballot = (await params).ballot;
  const { passcode } = await request.json();

  return Response.json({
    subject: "Success",
    body: "Logged In.",
  });
}

export async function PUT(request: Request) {
  const {} = request.json();
  return Response.json({ user: 1 }, { status: 201 });
}

export async function PATCH(request: Request) {
  const {} = request.json();
  return Response.json({ user: 1 }, { status: 201 });
}

export async function DELETE(request: Request) {
  const {} = request.json();
  return Response.json({ user: 1 }, { status: 204 });
}
