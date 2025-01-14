const cron = require("node-cron");

const CRON_SCHEDULE = "* * * * *"; // Runs every minute
const ENDPOINT_URL = "http://localhost:3000/api/loads";

cron.schedule(CRON_SCHEDULE, async () => {
  console.log("Running cron job: Checking for finished loads...");
  try {
    const response = await fetch(ENDPOINT_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Cron job completed:", data);
  } catch (error) {
    console.error("Cron job failed:", error.message);
  }
});

console.log("Cron job initialized. Waiting for the next execution...");
