import { cronJobs } from "convex/server";

import { internal } from "./_generated/api";

const crons = cronJobs();

// Clean up old daily credit records every day at 00:05 UTC+7 (17:05 UTC)
// This runs after the date changes in UTC+7 to clean up yesterday's records
crons.daily(
  "cleanup old daily credits",
  { hourUTC: 17, minuteUTC: 5 }, // 00:05 UTC+7
  internal.credits.cleanupOldCredits,
);

export default crons;
