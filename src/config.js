const UserAgent = require('user-agents');

const CONFIG = {
  get headers() {
    return {
      "User-Agent": new UserAgent().toString(),
    };
  },
  crawlDelay: 1000, // 1 second delay between requests
  timeout: 10000,   // Timeout after 10 seconds
  proxy: process.env.PROXY || null, // Optional proxy support
  retries: 3, // Retry failed requests 3 times
};

module.exports = CONFIG;
