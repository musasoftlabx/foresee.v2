/* Redis commands
  Config file > /opt/homebrew/etc/redis.conf
  Check if server is alive > redis-cli ping
  Configure password > config set requirepass @E-Ballot-DB#
  Restart redis > brew services restart redis
*/

// * NPM
import Redis from "ioredis";

function redisDB() {
  try {
    const redis = new Redis({
      host: process.env.REDIS_DB_HOST, //"redis-13309.c341.af-south-1-1.ec2.redns.redis-cloud.com",
      port: process.env.REDIS_DB_PORT, //13309,
      username: process.env.REDIS_DB_USERNAME,
      password: process.env.REDIS_DB_PASSWORD,
    });
    //console.log("connected redis");
    return redis;
  } catch (ex: any) {
    //console.log(ex.message);
    return ex.message;
  }
}

export default redisDB();
