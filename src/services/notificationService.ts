import { log } from "../utils";
import { UserVerifyType } from "../types/userVerify.type";
import { TransactionType } from "../types/transaction.type";

import { Config } from "../config";

import axios, { AxiosInstance } from "axios";

const query =
  "mutation Mutation($id: String!, $type: String!, $action: String!, $payload: JSONObject!) {\n  publishSubscription(id: $id, type: $type, action: $action, payload: $payload)\n}\n";
const axiosInstance = axios.create({
  baseURL: Config.subscriptionUri,
});

export enum NotificationType {
  TRANSACTION_STATUS = "TRANSACTION_STATUS",
  ACCOUNT_STATUS = "ACCOUNT_STATUS",
  SUBSCRIPTION = "SUBSCRIPTION",
}

export class NotificationService {
  constructor(private readonly axios: AxiosInstance) {}

  static getInstance() {
    return new NotificationService(axiosInstance);
  }

  async publishTransactionStatus(payload: TransactionType) {
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
    } catch (err) {
      log.warn({
        func: "publishTransaction",
        checkoutId: payload.checkoutId,
        payload,
        err,
      });
    }
  }

  async publishUserStatus(payload: UserVerifyType) {
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
    } catch (err) {
      log.warn({
        func: "publishTransaction",
        userId: payload.userId,
        payload,
        err,
      });
    }
  }
}
