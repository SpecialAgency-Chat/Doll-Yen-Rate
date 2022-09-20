require("dotenv").config();
const { TwitterApi } = require("twitter-api-v2");
const { default:axios } = require("axios");
const cron = require("node-cron")
const API = new TwitterApi({ accessToken: process.env.ACCESS_TOKEN, accessSecret: process.env.ACCESS_SECRET, appKey: process.env.CONSUMER_KEY, appSecret: process.env.CONSUMER_SECRET });

const tweet = async () => {
  const { data } = await axios.post("https://api.bitfinex.com/v2/calc/fx", {
    ccy1: "USD",
    ccy2: "JPY"
  }, { headers: { "Content-Type": "application/json" } });
  await API.readWrite.v1.tweet(`1ドル ${data[0]} 円`);
  console.log("Tweet Successful");
}

tweet();

cron.schedule("*/60 * * * *", async () => {
  tweet();
});