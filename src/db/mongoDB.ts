// * NPM
import dayjs from "dayjs";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

dayjs.extend(require("dayjs/plugin/weekday"));
dayjs.extend(require("dayjs/plugin/localizedFormat"));
dayjs.extend(require("dayjs/plugin/utc"));
dayjs.extend(require("dayjs/plugin/timezone"));
dayjs.extend(require("dayjs/plugin/relativeTime"));
dayjs.extend(require("dayjs/plugin/updateLocale"));

/* dayjs.updateLocale("en", {
 relativeTime: {
   future: "in %s",
   past: "%s ago",
   s: "a few seconds ago",
   m: "a minute ago",
   mm: "%d minutes ago",
   h: "an hour ago",
   hh: "%d hours ago",
   d: "a day ago",
   dd: "%d days ago",
   M: "a month ago",
   MM: "%d months ago",
   y: "a year ago",
   yy: "%d years ago",
 },
});
dayjs.tz.setDefault("Africa/Nairobi"); */

mongoose
  .connect(`${process.env.MONGO_URI}/foresee`)
  .then(() => console.log("Connected!"))
  .catch((err: any) => console.error(err.message));

export { mongoose, Schema };
