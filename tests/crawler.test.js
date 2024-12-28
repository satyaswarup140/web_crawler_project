const { fetchStaticURLs } = require("../src/crawler");
const axios = require("axios");

// Mock Axios to prevent actual HTTP requests
jest.mock("axios");

test("Fetch static URLs from a valid domain", async () => {
  const domain = "https://example.com";

  // Mocked HTML response
  const mockHTML = `
    <html>
      <body>
        <a href="/product/1">Product 1</a>
        <a href="/product/2">Product 2</a>
      </body>
    </html>
  `;

  // Mock axios.get to return the mocked HTML
  axios.get.mockResolvedValue({ data: mockHTML });

  const urls = await fetchStaticURLs(domain);

  // Validate results
  expect(urls).toBeInstanceOf(Array);
  expect(urls.length).toBe(2);
  expect(urls).toContain("https://example.com/product/1");
  expect(urls).toContain("https://example.com/product/2");
});
