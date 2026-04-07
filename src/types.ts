import type { Dayjs } from "dayjs";

export type ByOn = { by: string; on: Dayjs };
export type DataGridApiResponse = { filtered: number; totalCount: number };
export type Operations = "default" | string;
export type GoogleOAuthToken = {
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
};
