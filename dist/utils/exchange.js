"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUSDCRate = void 0;
const axios_1 = __importDefault(require("axios"));
// Config
const exponentialBackoff_1 = require("../utils/exponentialBackoff");
const log_1 = require("./log");
const CoinRate_1 = require("../models/CoinRate");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const getUSDCRate = async () => {
    try {
        const coinRate = await CoinRate_1.CoinRate.findByPk("USDC");
        const thirtyMinutesAgo = moment_timezone_1.default.utc().subtract(30, "minutes");
        if (coinRate && moment_timezone_1.default.utc(coinRate.updatedAt).isAfter(thirtyMinutesAgo)) {
            return coinRate.rate;
        }
        const getCoingeckoFunc = async () => axios_1.default.get(`https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=USD`);
        const { result: response } = await (0, exponentialBackoff_1.exponentialBackOff)(getCoingeckoFunc);
        log_1.log.info({
            func: "getCoinRateFunc",
            data: response.data,
        }, "Got USDC PRICE");
        const rate = response.data["usd-coin"].usd || 1;
        if (coinRate) {
            await coinRate.update({
                rate,
            });
            return rate;
        }
        await CoinRate_1.CoinRate.create({
            id: "USDC",
            rate,
        });
        return rate;
    }
    catch (err) {
        log_1.log.info({
            func: "getCoinRateFunc",
            err,
        }, "Failed Get USDC PRICE");
        return 1;
    }
};
exports.getUSDCRate = getUSDCRate;
//# sourceMappingURL=exchange.js.map