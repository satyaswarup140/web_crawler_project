# Web Crawler Project

## Objective
Discover and list all product URLs across multiple e-commerce websites.

## Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the crawler:
   ```bash
   node src/index.js
   ```

## Output
- Results are stored in `output/results.json`.

## Tests
Run tests with:
```bash
npx jest
```

## Features
- **Static URL Parsing**: Handles HTML parsing with Cheerio.
- **Dynamic Content Handling**: Supports infinite scrolling and AJAX loading with Puppeteer.
- **Scalable and Modular**: Designed to scale to multiple domains.
