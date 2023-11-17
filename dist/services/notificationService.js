"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = exports.NotificationType = void 0;
const utils_1 = require("../utils");
const config_1 = require("../config");
const axios_1 = __importDefault(require("axios"));
const query = "mutation Mutation($id: String!, $type: String!, $action: String!, $payload: JSONObject!) {\n  publishSubscription(id: $id, type: $type, action: $action, payload: $payload)\n}\n";
const axiosInstance = axios_1.default.create({
    baseURL: config_1.Config.subscriptionUri,
});
var NotificationType;
(function (NotificationType) {
    NotificationType["TRANSACTION_STATUS"] = "TRANSACTION_STATUS";
    NotificationType["ACCOUNT_STATUS"] = "ACCOUNT_STATUS";
    NotificationType["SUBSCRIPTION"] = "SUBSCRIPTION";
})(NotificationType = exports.NotificationType || (exports.NotificationType = {}));
class NotificationService {
    constructor(axios) {
        this.axios = axios;
    }
    static getInstance() {
        return new NotificationService(axiosInstance);
    }
    async publishTransactionStatus(payload) {
        try {
            await this.axios.post("/graphql", {
                query,
                operationName: "Mutation",
                variables: {
                    id: payload.checkoutId,
                    type: NotificationType.TRANSACTION_STATUS,
                    action: "update",
                    payload,
                },
            });
        }
        catch (err) {
            utils_1.log.warn({
                func: "publishTransaction",
                checkoutId: payload.checkoutId,
                payload,
                err,
            });
        }
    }
    async publishUserStatus(payload) {
        try {
            await this.axios.post("/graphql", {
                query,
                operationName: "Mutation",
                variables: {
                    id: payload.userId,
                    type: NotificationType.ACCOUNT_STATUS,
                    action: "update",
                    payload,
                },
            });
        }
        catch (err) {
            utils_1.log.warn({
                func: "publishTransaction",
                userId: payload.userId,
                payload,
                err,
            });
        }
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notificationService.js.map