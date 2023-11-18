const request = require("request");
const rp = require("request-promise");
const cheerio = require("cheerio");

scrape("url");

async function scrape(url) {
  var options = {
    uri:
      "https://www.amazon.com/Click-Grow-Garden-Gardening-Capsules/dp/B01MRVMKQH",
    qs: {
      access_token: "xxxxx xxxxx" // -> uri + '?access_token=xxxxx%20xxxxx'
    },
    headers: {
      "User-Agent": "Request-Promise"
    },
    json: true // Automatically parses the JSON string in the response
  };
  rp(options)
    .then(function(res) {
      console.log(res);
    })
    .catch(function(err) {
      throw err;
    });
}
