// scheduler.ts
import cron from "node-cron";

const monthlyTask = async (): Promise<void> => {
  try {
    console.log("Running task at the beginning of each month");

    // your logic here
    // example:
    // await resetBudget();
    // await generateReport();

  } catch (error) {
    console.error("Cron job error:", error);
  }
};



cron.schedule(
  "0 0 1 * *",
  async () => {
    await monthlyTask();
  },
  {
    timezone: "Asia/Kuala_Lumpur",
  }
);

console.log("Scheduler started");