// scheduler.ts
import cron from "node-cron";

const dailyTask = async (): Promise<void> => {
  try {
    console.log("Running task at midnight");

    // your logic here
    // example:
    // await resetBudget();
    // await generateReport();

  } catch (error) {
    console.error("Cron job error:", error);
  }
};



cron.schedule(
  "0 0 * * *",
  async () => {
    await dailyTask();
  },
  {
    timezone: "Asia/Kuala_Lumpur",
  }
);


console.log("Scheduler started");