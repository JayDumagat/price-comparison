const { chromium } = require('playwright');
const chalk = require('chalk');

async function scrapeNewegg(searchQuery) {
  const browser = await chromium.launch({ headless: true });


  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.89 Safari/537.36',
  });

  const page = await context.newPage();

  console.log(chalk.blue(`🔍 Scraping Newegg for query: ${searchQuery}`));

  try {
    await page.goto(`https://www.newegg.com/p/pl?d=${searchQuery}`, {
      waitUntil: 'domcontentloaded',
    });

    await page.waitForSelector('.item-cell', { timeout: 60000 });

    const items = await page.$$eval('.item-cell', (elements) =>
      elements
        .slice(0, 5)
        .map((el) => {
          const title = el.querySelector('.item-title')?.innerText.trim();
          const price = el.querySelector('.price-current')?.innerText.trim();
          return title && price ? { title, price } : null;
        })
        .filter(Boolean)
    );

    console.log(chalk.green(`✅ Successfully scraped Newegg for query: ${searchQuery}`));
    await browser.close();
    return items;
  } catch (error) {
    console.error(chalk.red(`❌ Error scraping Newegg with Playwright: ${error.message}`));
    if (error.name === 'TimeoutError') {
      console.error('❌ Timeout occurred while waiting for selectors.');
    } else {
      console.error('❌ General error occurred during scraping');
    }
    await browser.close();
    return [];
  }
}

module.exports = scrapeNewegg;
