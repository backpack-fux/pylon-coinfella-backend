import axios, { AxiosInstance } from "axios";
import { Config } from "../config";

export class DiscordService {
  axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: Config.discordUri,
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (err) => {
        const error = err.response;

        if (error?.data) {
          throw error.data;
        }

        throw error;
      }
    );
  }

  static getInstance() {
    return new DiscordService();
  }

  async send(content: string) {
    try {
      const res = await this.axiosInstance.post("", {
        content,
      });

      return res.data;
    } catch (err) {}
  }
}