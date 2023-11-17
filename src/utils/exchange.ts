import axios from "axios";

// Config
import { exponentialBackOff } from "../utils/exponentialBackoff";
import { log } from "./log";
import { CoinRate } from "../models/CoinRate";
import moment from "moment-timezone";

export const getUSDCRate = async () => {
  try {
    const coinRate = await CoinRate.findByPk("USDC");
    const thirtyMinutesAgo = moment.utc().subtract(30, "minutes");

    if (coinRate && moment.utc(coinRate.updatedAt).isAfter(thirtyMinutesAgo)) {
      return coinRate.rate;
    }

    const getCoingeckoFunc = async () =>
      axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=USD`
      );
    const { result: response } = await exponentialBackOff(getCoingeckoFunc);

    log.info(
      {
        func: "getCoinRateFunc",
        data: response.data,
      },
      "Got USDC PRICE"
    );

    const rate = response.data["usd-coin"].usd || 1;

    if (coinRate) {
      await coinRate.update({
        rate,
      });

      return rate;
    }

    await CoinRate.create({
      id: "USDC",
      rate,
    });

    return rate;
  } catch (err) {
    log.info(
      {
        func: "getCoinRateFunc",
        err,
      },
      "Failed Get USDC PRICE"
    );

    return 1;
  }
};
