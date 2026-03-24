import dayjs, { Dayjs } from "dayjs";

export function dayjsDayFormatter(date: Dayjs) {
  return dayjs(date).format("ddd, Do MMM YYYY [at] hh:mm:ss a");
}
