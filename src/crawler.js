const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { isValidProductURL } = require("./utils");
const CONFIG = require("./config");

// Helper for delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch static URLs using Axios and Cheerio
async function fetchStaticURLs(domain) {
  const productURLs = new Set();

  for (let attempt = 0; attempt < CONFIG.retries; attempt++) {
    try {
      const response = await axios.get(domain, { 
        headers: CONFIG.headers, 
        timeout: CONFIG.timeout 
      });
      const $ = cheerio.load(response.data);

      $("a").each((_, element) => {
        const url = $(element).attr("href");
        if (url && isValidProductURL(url)) {
          productURLs.add(new URL(url, domain).href);
        }
      });

      break; // Exit retry loop on success
    } catch (error) {
      console.error(`Attempt ${attempt + 1}: Error fetching ${domain}: ${error.message}`);
      if (attempt === CONFIG.retries - 1) {
        console.error(`Failed to fetch ${domain} after ${CONFIG.retries} attempts.`);
      }
      await delay(CONFIG.crawlDelay); // Delay before retrying
    }
  }

  return Array.from(productURLs);
}

// Fetch dynamic URLs using Puppeteer
async function fetchDynamicURLs(domain) {
  const productURLs = new Set();

  try {
    const browser = await puppeteer.launch({
      headless: true, // Set to false if you want to debug in the browser
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setUserAgent(CONFIG.headers["User-Agent"]);
    await page.goto(domain, { waitUntil: "networkidle2", timeout: CONFIG.timeout });

    // Infinite scrolling simulation
    let previousHeight;
    do {
      previousHeight = await page.evaluate(() => document.body.scrollHeight);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await delay(CONFIG.crawlDelay);
    } while ((await page.evaluate(() => document.body.scrollHeight)) > previousHeight);

    // Extract all links
    const urls = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href]"), (a) => a.href)
    );

    urls.forEach((url) => {
      if (isValidProductURL(url)) {
        productURLs.add(url);
      }
    });

    await browser.close();
  } catch (error) {
    console.error(`Error fetching dynamic URLs from ${domain}: ${error.message}`);
  }

  return Array.from(productURLs);
}

// Main crawl function to combine static and dynamic URLs
async function crawlDomain(domain) {
  console.log(`Crawling ${domain}...`);
  const staticURLs = await fetchStaticURLs(domain);
  const dynamicURLs = await fetchDynamicURLs(domain);
  const allURLs = Array.from(new Set([...staticURLs, ...dynamicURLs])); // Remove duplicates
  console.log(`Crawling completed for ${domain}. Found ${allURLs.length} product URLs.`);
  return allURLs;
}

module.exports = { crawlDomain, fetchStaticURLs }; 
