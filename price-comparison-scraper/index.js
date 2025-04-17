const chalk = require("chalk");
const scrapeNewegg = require("./scrapers/newegg");
const scrapeEbay = require("./scrapers/ebay");
const { saveData } = require("./utils/dataStorage");
const { searchAndFilter } = require("./utils/searchAndFilter");
const config = require('./config');
const { searchQuery, delayTime, cronSchedule } = config;
const cron = require("node-cron");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

cron.schedule(cronSchedule, async () => {
  console.log(
    chalk.blue(`🔍 Running scheduled scrape for: ${searchQuery.toUpperCase()}`)
  );

  await delay(delayTime);

  const [neweggResults, ebayResults] = await Promise.all([
    scrapeNewegg(searchQuery),
    scrapeEbay(searchQuery),
  ]);

  console.log(chalk.yellow("\n📦 Newegg Results:"));
  neweggResults.forEach((item, index) => {
    console.log(`${index + 1}. ${item.title} - ${chalk.green(item.price)}`);
  });

  console.log(chalk.cyan("\n📦 eBay Results:"));
  ebayResults.forEach((item, index) => {
    console.log(`${index + 1}. ${item.title} - ${chalk.green(item.price)}`);
  });

  const combinedResults = [...neweggResults, ...ebayResults];
  saveData(combinedResults);

  console.log(chalk.green("✅ Data saved successfully!"));

  console.log(chalk.blue("🔍 Searching and filtering data..."));
  searchAndFilter(searchQuery, 0, 2000);
  console.log(chalk.green("✅ Search and filter completed!"));
});

console.log("🔔 Scraping task scheduled to run every 1 minute...");

console.log("🔔 To stop the task, press Ctrl+C.");
