import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_DB_HOST,
  port: process.env.REDIS_DB_PORT,
  password: process.env.REDIS_DB_PASSWORD,
});

console.log(redis);

export const redisCluster = async (
  service: string,
  environment?: "development" | "production" | "test",
) => {
  if (process.env.HOSTNAME === "svdt1dirportal.safaricom.net")
    environment = "development";

  const configs = (await redis.keys(
    `configs:${environment ?? process.env.NODE_ENV}:${service}:*`,
  )) as any;

  let dataset = [];

  for (const config of configs) {
    const item = config.split(":");
    dataset[item[3]] = await redis.get(config);
  }

  return dataset;
};
