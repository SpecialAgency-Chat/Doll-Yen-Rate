require("dotenv").config();
const { TwitterApi } = require("twitter-api-v2");
const { default:axios } = require("axios");
const cron = require("node-cron")
const API = new TwitterApi({ accessToken: process.env.ACCESS_TOKEN, accessSecret: process.env.ACCESS_SECRET, appKey: process.env.CONSUMER_KEY, appSecret: process.env.CONSUMER_SECRET });

let PREVIOUS;

const tweet = async () => {
  const { data } = await axios.post("https://api.bitfinex.com/v2/calc/fx", {
    ccy1: "USD",
    ccy2: "JPY"
  }, { headers: { "Content-Type": "application/json" } });
  let text = `1ドル ${data[0]} 円`;
  if (PREVIOUS) {
    if ((PREVIOUS - data[0]) >= 2) {
      text += "\n⚠前回より2円以上低下しています⚠";
    }
    if ((data[0] - PREVIOUS) >= 2) {
      text += "\n⚠前回より2円以上上昇しています⚠";
    } else if (data[0] === PREVIOUS) {
      text += " (前回と同じ)";
    }
  }
  PREVIOUS = data[0];
  await API.readWrite.v1.tweet(`1ドル ${data[0]} 円`).catch(() => {});
  await axios.post(process.env.GAS_API, { current: data[0]}, { headers: { "Content-Type": "application/json"}  });
  console.log("Tweet Successful");
}

tweet();

cron.schedule("*/60 * * * *", async () => {
  tweet();
});