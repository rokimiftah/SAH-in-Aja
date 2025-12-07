import { cronJobs } from "convex/server";

import { internal } from "./_generated/api";

const crons = cronJobs();

// Reset all user daily credits at 00:00 UTC+7 (17:00 UTC)
// Creates new records for today and cleans up old records
crons.daily(
  "reset all daily credits",
  { hourUTC: 17, minuteUTC: 0 }, // 00:00 UTC+7
  internal.credits.resetAllDailyCredits,
);

export default crons;
