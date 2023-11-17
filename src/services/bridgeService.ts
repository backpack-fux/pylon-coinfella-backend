import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CreateAxiosDefaults,
} from "axios";
import { Config } from "../config";
import { log } from "../utils";

export class BridgeService {
  constructor(private axios: AxiosInstance) {}

  static getInstance() {
    const axios = Axios.create({
      baseURL: `${Config.bridgeApiURI}`,
      headers: {
        "Api-Key": Config.bridgeApiKey,
      },
    });

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const data = error?.response?.data || error.response;

        log.error(
          {
            func: "BridgeService.error",
            data,
          },
          "Error: sending bridge"
        );

        if (!data) {
          throw error;
        }

        if (data.code === "invalid_parameters" && data.source?.key) {
          const errors = Object.values(data.source.key);

          if (errors.length) {
            throw new Error(errors.join(", "));
          }
        }

        throw data;
      }
    );

    const instance = new BridgeService(axios);
    return instance;
  }

  async send(config: AxiosRequestConfig<any>, uuid?: string) {
    log.info(
      {
        func: "brideService.send",
        uuid,
        ...config,
      },
      `Sending ${config.url} request`
    );

    try {
      const res = await this.axios.request({
        ...config,
        headers: {
          ...config.headers,
          "Idempotency-Key": uuid,
        },
      });

      return res;
    } catch (err) {
      log.info(
        {
          func: "brideService.send",
          uuid,
          ...config,
          err,
        },
        `Failed ${config.url} request`
      );

      throw err;
    }
  }

  async createTermsOfServiceUrl(uuid: string): Promise<string> {
    const res = await this.send(
      {
        method: "POST",
        url: "/customers/tos_links",
      },
      uuid
    );

    return res.data.url;
  }

  async createCustomer(data: any, uuid: string) {
    const res = await this.send(
      {
        method: "POST",
        url: "/customers",
        data,
      },
      uuid
    );

    return res.data;
  }

  async createKycUrl(customerId: string, redirectUri: string): Promise<string> {
    const res = await this.send({
      method: "GET",
      url: `/customers/${customerId}/id_verification_link`,
      params: {
        redirect_uri: redirectUri,
      },
    });

    return res.data.url;
  }

  async getCustomer(customerId: string): Promise<any> {
    const res = await this.send({
      method: "GET",
      url: `/customers/${customerId}`,
    });

    return res.data;
  }

  async createKycLink({
    idempotencyKey,
    name,
    type,
    email,
  }: {
    idempotencyKey: string;
    name: string;
    type: "individual" | "business";
    email: string;
  }) {
    const res = await this.send(
      {
        method: "POST",
        url: "/kyc_links",
        data: {
          full_name: name,
          email,
          type,
        },
      },
      idempotencyKey
    );

    return res.data;
  }

  async getKycLink(kycLinkId: string): Promise<any> {
    const res = await this.send({
      method: "GET",
      url: `/kyc_links/${kycLinkId}`,
    });

    return res.data;
  }
}
