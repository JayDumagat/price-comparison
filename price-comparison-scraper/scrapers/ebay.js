const axios = require("axios");
const cheerio = require("cheerio");
const chalk = require("chalk");
const retry = require("async-retry");

const scrapeEbay = async (query) => {
  return await retry(
    async () => {
      try {
        console.log(
          chalk.blue(`🔍 Starting to scrape eBay for query: ${query}`)
        );

        const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(
          query
        )}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const results = [];

        $(".s-item")
          .slice(0, 5)
          .each((_, el) => {
            const title = $(el).find(".s-item__title").text().trim();
            const price = $(el).find(".s-item__price").text().trim();

            if (
              title &&
              price &&
              !title.toLowerCase().includes("shop on ebay")
            ) {
              results.push({ title, price });
            }
          });

        console.log(
          chalk.green(`✅ Successfully scraped eBay for query: ${query}`)
        );
        return results;
      } catch (error) {
        console.error(chalk.red(`❌ Error scraping eBay: ${error.message}`));
        if (error.response) {
          console.error(`Response error: ${error.response.status}`);
        } else if (error.request) {
          console.error("No response received from the request");
        } else {
          console.error(
            "Error occurred during setup or request",
            error.message
          );
        }
        return [];
      }
    },
    {
      retries: 3,
      minTimeout: 1000,
    }
  );
};

module.exports = scrapeEbay;
