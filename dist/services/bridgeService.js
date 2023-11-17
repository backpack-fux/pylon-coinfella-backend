"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const utils_1 = require("../utils");
class BridgeService {
    constructor(axios) {
        this.axios = axios;
    }
    static getInstance() {
        const axios = axios_1.default.create({
            baseURL: `${config_1.Config.bridgeApiURI}`,
            headers: {
                "Api-Key": config_1.Config.bridgeApiKey,
            },
        });
        axios.interceptors.response.use((response) => response, (error) => {
            var _a, _b;
            const data = ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.response;
            utils_1.log.error({
                func: "BridgeService.error",
                data,
            }, "Error: sending bridge");
            if (!data) {
                throw error;
            }
            if (data.code === "invalid_parameters" && ((_b = data.source) === null || _b === void 0 ? void 0 : _b.key)) {
                const errors = Object.values(data.source.key);
                if (errors.length) {
                    throw new Error(errors.join(", "));
                }
            }
            throw data;
        });
        const instance = new BridgeService(axios);
        return instance;
    }
    async send(config, uuid) {
        utils_1.log.info({
            func: "brideService.send",
            uuid,
            ...config,
        }, `Sending ${config.url} request`);
        try {
            const res = await this.axios.request({
                ...config,
                headers: {
                    ...config.headers,
                    "Idempotency-Key": uuid,
                },
            });
            return res;
        }
        catch (err) {
            utils_1.log.info({
                func: "brideService.send",
                uuid,
                ...config,
                err,
            }, `Failed ${config.url} request`);
            throw err;
        }
    }
    async createTermsOfServiceUrl(uuid) {
        const res = await this.send({
            method: "POST",
            url: "/customers/tos_links",
        }, uuid);
        return res.data.url;
    }
    async createCustomer(data, uuid) {
        const res = await this.send({
            method: "POST",
            url: "/customers",
            data,
        }, uuid);
        return res.data;
    }
    async createKycUrl(customerId, redirectUri) {
        const res = await this.send({
            method: "GET",
            url: `/customers/${customerId}/id_verification_link`,
            params: {
                redirect_uri: redirectUri,
            },
        });
        return res.data.url;
    }
    async getCustomer(customerId) {
        const res = await this.send({
            method: "GET",
            url: `/customers/${customerId}`,
        });
        return res.data;
    }
    async createKycLink({ idempotencyKey, name, type, email, }) {
        const res = await this.send({
            method: "POST",
            url: "/kyc_links",
            data: {
                full_name: name,
                email,
                type,
            },
        }, idempotencyKey);
        return res.data;
    }
    async getKycLink(kycLinkId) {
        const res = await this.send({
            method: "GET",
            url: `/kyc_links/${kycLinkId}`,
        });
        return res.data;
    }
}
exports.BridgeService = BridgeService;
//# sourceMappingURL=bridgeService.js.map