// * Server
import { type NextRequest, NextResponse } from "next/server";

import { redis } from "@/helpers/configureRedis";

const namespace = "configs";

export async function GET() {
  const configs = await redis.keys(`${namespace}:*`);

  const dataset = [];

  for (const [id, config] of configs.entries()) {
    const item = config.split(":");
    dataset.push({
      id: id + 1,
      environment: item[1],
      service: item[2],
      key: item[3],
      value: await redis.get(config),
    });
  }

  return NextResponse.json({
    dataset: dataset.sort(
      (a, b) => Number(b.environment) - Number(a.environment),
    ),
    totalCount: dataset.length,
  });
}

export async function PATCH(request: NextRequest) {
  const { service, environment, key, value } = await request.json();

  try {
    return NextResponse.json(
      await redis.set(`${namespace}:${environment}:${service}:${key}`, value),
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { icon: "", error: error.name, message: error.message },
        { status: 400 },
      );
    }
  }
}

export async function DELETE(request: NextRequest) {
  const { attributes } = await request.json();
  return new NextResponse(
    (await redis.del(`${namespace}:${attributes}`)).toString(),
  );
}
