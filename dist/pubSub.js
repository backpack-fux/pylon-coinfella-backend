"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_subscriptions_1 = require("graphql-subscriptions");
const typedi_1 = __importDefault(require("typedi"));
typedi_1.default.set("pubsub", new graphql_subscriptions_1.PubSub());
//# sourceMappingURL=pubSub.js.map