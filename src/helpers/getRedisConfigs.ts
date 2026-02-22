import { redis } from "./DB.connect";

export default async function getRedisConfigs(
  service: string,
  environment?: "development" | "production" | "test"
) {
  if (process.env.HOSTNAME === "svdt1dirportal.safaricom.net")
    environment = "development";

  const configs: any = await redis.keys(
    `configs:${environment ?? process.env.NODE_ENV}:${service}:*`
  );

  let dataset: any = {};

  for (const config of configs) {
    const item = config.split(":");
    dataset[item[3]] = await redis.get(config);
  }

  return dataset;
}
