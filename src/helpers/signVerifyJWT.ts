// * Next
import type { NextApiRequest } from "next";

// * NPM
import JWT from "jsonwebtoken";

// * Helpers
import { redis } from "./DB.connect";
import getRedisConfigs from "./getRedisConfigs";
import lastPasswordChange from "./lastPasswordChange";

// * Interface
export interface iJWTdata {
  dealerType: string;
  dealerCode: string;
  dealerName: string;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  role: string;
  roleAttributes: {};
  iat: number;
  exp: number;
}

const verifyJWT = async (req: NextApiRequest) => {
  const configs: Configs = await getRedisConfigs("DP");

  const { authorization } = req.headers; // ? Destructure headers to get authorization header

  if (authorization)
    // ? If authorization header exists, verify the token
    try {
      const payload = <iJWTdata>(
        JWT.verify(authorization.split(" ")[1], configs.ACCESS_TOKEN)
      );
      // ? If token verification passes, check if username exists in redis (This is to force logout since tokens cannot be invalidated)
      const exists = await redis.exists(`loggedIn: ${payload.username}`);

      if (exists) return payload; // ? If username exists in redis,
      else return false; // ? If username does not exists in redis, return false to force logout
    } catch (e) {
      // ? If token verification fails, return false to force logout
      return false;
    }
  // ? If authorization header does not exist, return false to force logout
  else return false;
};

const signJWT = async (req: NextApiRequest) => {
  const configs: Configs = await getRedisConfigs("DP");

  // ? Verify the token to check if it's still valid which returns the payload
  const payload = <iJWTdata>await verifyJWT(req);

  if (payload) {
    // ? If payload is valid, sign a new token
    const accessToken = JWT.sign(
      {
        _: await lastPasswordChange(payload.username),
        dealerCode: payload.dealerCode,
        dealerName: payload.dealerName,
        dealerType: payload.dealerType,
        username: payload.username,
        firstName: payload.firstName,
        middleName: payload.middleName,
        lastName: payload.lastName,
        role: payload.role,
        roleAttributes: payload.roleAttributes,
      },
      configs.ACCESS_TOKEN,
      { expiresIn: `${configs.ACCESS_TOKEN_EXPIRY_IN_MINUTES}m` }
    );
    // ? Replace the old token on redis too
    await redis.set(
      `loggedIn: ${payload.username}`,
      accessToken,
      "EX",
      parseInt(configs.ACCESS_TOKEN_EXPIRY_IN_MINUTES) * 60
    );

    return accessToken;
  }
  // ? If payload is not valid, return false to force logout
  else return false;
};

export { signJWT, verifyJWT };
