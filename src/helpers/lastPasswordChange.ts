// * Helpers
import { DB } from "./DB.connect";

export default async function lastPasswordChange(username: string) {
  const resetSource = await DB.getval(
    `SELECT resetSource FROM dp_password_resets WHERE username = ? ORDER BY id DESC LIMIT 1`,
    [username]
  );
  return resetSource === "System-Generated" ? true : false;
}
