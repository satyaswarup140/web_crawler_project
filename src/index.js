const { crawlDomain } = require("./crawler");
const { saveResults } = require("./utils");
const fs = require("fs");
const path = require("path");

// Define domains to crawl
const domains = [
  "https://example1.com",
  "https://example2.com",
  "https://example3.com"
];

// Main function to run the crawler
(async () => {
  console.log("Starting web crawler...");

  const results = {};
  for (const domain of domains) {
    console.log(`Crawling ${domain}...`);
    const urls = await crawlDomain(domain);
    results[domain] = urls;
  }

  // Save results using the utility function
  saveResults(results);

  // Save results to output/results.json manually
  const outputPath = path.resolve(__dirname, "../output/results.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`Crawling completed. Results saved to ${outputPath}`);
})();
