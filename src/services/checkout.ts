import { Config } from "../config";

import bluebird from "bluebird";

import { Charge } from "../models/Charge";
import { Checkout } from "../models/Checkout";

import { CheckoutSdkService } from "./checkoutSdk";

import { log } from "../utils";
import { convertToCharge } from "../utils/convert";

import { PaidStatus } from "../types/paidStatus.type";
import { CheckoutStep } from "../types/checkoutStep.type";
import { CheckoutInputType } from "../types/checkout-input.type";
import { NotificationService } from "./notificationService";
import { CheckoutRequest } from "../models/CheckoutRequest";
import { TipType } from "../types/tip.type";
import { User } from "../models/User";
import { getUSDCRate } from "../utils/exchange";
import { AssetTransfer } from "../models/AssetTransfer";
import { Web3Service } from "./web3Service";
import { SettingService } from "./settingService";
import { TransactionType } from "../types/transaction.type";

const checkoutSdkService = CheckoutSdkService.getInstance();
const notificationService = NotificationService.getInstance();
const web3Service = Web3Service.getInstance();
const settingsService = SettingService.getInstance();
export class CheckoutService {
  static getInstance() {
    return new CheckoutService(checkoutSdkService, notificationService);
  }

  constructor(
    private checkoutSdk: CheckoutSdkService,
    private notification: NotificationService
  ) {}

  async process(data: CheckoutInputType, user?: User) {
    let checkoutRequest: CheckoutRequest;
    if (data.checkoutRequestId) {
      checkoutRequest = await CheckoutRequest.findByPk(data.checkoutRequestId);

      if (!checkoutRequest) {
        throw new Error("Can't find checkout request");
      }

      if (checkoutRequest.status === PaidStatus.Paid) {
        throw new Error("Already paid");
      }

      if (checkoutRequest.status === PaidStatus.Processing) {
        throw new Error("Already in progress");
      }

      if (checkoutRequest.status === PaidStatus.Postponed) {
        throw new Error("Request postponed, please wait");
      }

      if (checkoutRequest.walletAddress !== data.walletAddress) {
        throw new Error("Mismatch wallet address");
      }

      if (
        checkoutRequest.phoneNumber &&
        checkoutRequest.phoneNumber !== data.phoneNumber
      ) {
        throw new Error("Mismatch phone number");
      }

      if (checkoutRequest.email && checkoutRequest.email !== data.email) {
        throw new Error("Mismatch email address");
      }

      if (Number(checkoutRequest.amount) !== Number(data.amount)) {
        throw new Error("Mismatch amount");
      }

      if (data.fee && Number(checkoutRequest.fee) !== Number(data.fee)) {
        throw new Error("Mismatch fee");
      }

      if (data.feeType && checkoutRequest.feeType !== data.feeType) {
        throw new Error("Mismatch fee type");
      }

      if (checkoutRequest.feeMethod !== data.feeMethod) {
        throw new Error("Mismatch fee method");
      }
    }

    const checkout = await Checkout.create({
      ...data,
      userId: user?.id,
      fee: data.fee || Config.defaultFee.fee,
      feeType: (data.feeType || Config.defaultFee.feeType) as TipType,
    });

    const partner = await checkoutRequest?.getPartner();

    if (partner) {
      await partner.sendWebhook(
        checkoutRequest.partnerOrderId,
        "order",
        "create",
        {
          id: checkoutRequest.id,
          walletAddress: checkoutRequest.walletAddress,
          email: checkoutRequest.email,
          phoneNumber: checkoutRequest.phoneNumber,
          status: checkoutRequest.status,
          partnerOrderId: checkoutRequest.partnerOrderId,
          feeAmount: checkout.feeAmountMoney.toUnit(),
          tipAmount: checkout.tipAmountMoney.toUnit(),
          chargeAmount: checkout.totalChargeAmountMoney.toUnit(),
          customer: {
            id: user?.id,
            firstName: user?.firstName || checkout.firstName,
            lastName: user?.lastName || checkout.lastName,
            email: user?.email || checkout.email,
            phoneNumber: user?.phoneNumber || checkout.phoneNumber,
            ssn: user?.ssn,
            dob: user?.dob,
            status: user?.status,
            streetAddress: user?.streetAddress || checkout.streetAddress,
            streetAddress2: user?.streetAddress2 || checkout.streetAddress2,
            city: user?.city || checkout.city,
            postalCode: user?.postalCode || checkout.postalCode,
            state: user?.state || checkout.state,
            country: user?.country || checkout.country,
          },
        }
      );
    }

    return checkout;
  }

  private async markAsCheckout(checkout: Checkout, status: PaidStatus) {
    await checkout.update({
      status,
    });

    const checkoutRequest = await checkout.getCheckoutRequest();
    await checkoutRequest?.update({
      status,
    });

    const partner = await checkoutRequest?.getPartner();

    if (!partner) {
      return;
    }

    const charge = await checkout.getCharge();
    const assetTransfer = await checkout.getAssetTransfer();
    const user = await checkout.getUser();

    await partner.sendWebhook(
      checkoutRequest.partnerOrderId,
      "order",
      "update",
      {
        id: checkoutRequest.id,
        walletAddress: checkoutRequest.walletAddress,
        email: checkoutRequest.email,
        phoneNumber: checkoutRequest.phoneNumber,
        status: checkoutRequest.status,
        partnerOrderId: checkoutRequest.partnerOrderId,
        transactionHash: assetTransfer?.transactionHash,
        feeAmount: checkout.feeAmountMoney.toUnit(),
        tipAmount: checkout.tipAmountMoney.toUnit(),
        chargeAmount: checkout.totalChargeAmountMoney.toUnit(),
        unitAmount: assetTransfer?.amount,
        chargeId: charge?.id,
        chargeCode: charge?.code,
        chargeMsg: charge?.message,
        chargeStatus: charge?.status,
        last4: charge?.last4,
        customer: {
          id: user?.id,
          firstName: user?.firstName || checkout.firstName,
          lastName: user?.lastName || checkout.lastName,
          email: user?.email || checkout.email,
          phoneNumber: user?.phoneNumber || checkout.phoneNumber,
          ssn: user?.ssn,
          dob: user?.dob,
          status: user?.status,
          streetAddress: user?.streetAddress || checkout.streetAddress,
          streetAddress2: user?.streetAddress2 || checkout.streetAddress2,
          city: user?.city || checkout.city,
          postalCode: user?.postalCode || checkout.postalCode,
          state: user?.state || checkout.state,
          country: user?.country || checkout.country,
        },
      }
    );
  }

  private async processCharge(checkout: Checkout) {
    try {
      await this.notification.publishTransactionStatus({
        checkoutId: checkout.id,
        step: CheckoutStep.Charge,
        status: "processing",
        paidStatus: checkout.status,
        message: `Processing charge $${checkout.totalChargeAmountMoney.toUnit()}`,
        transactionId: null,
        date: new Date(),
      });

      const charge = await this.checkoutSdk.charge(checkout);
      const chargeData = convertToCharge(charge);
      const chargeRecord = await Charge.create({
        checkoutId: checkout.id,
        ...chargeData,
      });

      if (chargeRecord.status !== "Authorized") {
        const message = chargeRecord.message
          ? `${chargeRecord.code}: ${chargeRecord.message}`
          : `Failed Charge $${checkout.totalChargeAmountMoney.toUnit()} with ${
              chargeRecord.status
            }`;
        throw new Error(message);
      }

      await this.notification.publishTransactionStatus({
        checkoutId: checkout.id,
        step: CheckoutStep.Charge,
        status: "settled",
        paidStatus: checkout.status,
        message: `Charged $${checkout.totalChargeAmountMoney.toUnit()}`,
        transactionId: null,
        date: new Date(),
      });
    } catch (err) {
      log.warn(
        {
          func: "processCharge",
          checkoutId: checkout.id,
          err,
        },
        "Failed processCharge"
      );

      await this.markAsCheckout(checkout, PaidStatus.Error);

      await this.notification.publishTransactionStatus({
        checkoutId: checkout.id,
        status: "failed",
        paidStatus: checkout.status,
        step: CheckoutStep.Charge,
        message: err.message,
        transactionId: null,
        date: new Date(),
      });

      throw err;
    }
  }

  async processCheckout(checkout: Checkout) {
    await bluebird.delay(2000);

    try {
      await this.markAsCheckout(checkout, PaidStatus.Processing);
      await this.processCharge(checkout);

      const isEnabledAssetTransfer = await settingsService.getSetting(
        "assetTransfer"
      );

      if (!isEnabledAssetTransfer) {
        await this.markAsCheckout(checkout, PaidStatus.Paid);
        await this.notification.publishTransactionStatus({
          checkoutId: checkout.id,
          step: CheckoutStep.Charge,
          status: "charged",
          paidStatus: checkout.status,
          transactionId: "",
          message: `Charged ${checkout.totalChargeAmountMoney.toUnit()}`,
          date: new Date(),
        });
        await checkout.sendReceipt();
      } else {
        await this.markAsCheckout(checkout, PaidStatus.Processing);
        await this.processTransferAsset(checkout);
      }
    } catch (err) {
      log.warn({
        func: "processCheckout",
        checkoutId: checkout.id,
        err,
      });
    }
  }

  async processTransferAsset(checkout: Checkout) {
    let assetTransfer: AssetTransfer;
    try {
      const rate = await getUSDCRate();
      const amount = Number(
        (checkout.fundsAmountMoney.toUnit() / rate).toFixed(6)
      );

      const assetTransfer = await AssetTransfer.create({
        checkoutId: checkout.id,
        status: PaidStatus.Processing,
        rate,
        amount,
        fee: 0,
      });

      await this.notification.publishTransactionStatus({
        checkoutId: checkout.id,
        step: CheckoutStep.Asset,
        status: "processing",
        paidStatus: checkout.status,
        message: `Sending ${assetTransfer.amount} USDC`,
        transactionId: null,
        date: new Date(),
      });

      const sendingAmount = Config.isProduction ? assetTransfer.amount : 0.1;
      const receipt = await web3Service.send(
        checkout.walletAddress,
        sendingAmount
      );

      await assetTransfer.update({
        transactionHash: receipt.transactionHash,
        status: receipt.status ? PaidStatus.Paid : PaidStatus.Error,
        settledAt: receipt.status ? new Date() : undefined,
      });

      const checkoutRequest = await checkout.getCheckoutRequest();

      if (checkoutRequest) {
        await checkoutRequest.update({
          transactionHash: receipt.transactionHash,
        });
      }

      if (!receipt.status) {
        throw new Error(`Failed sending ${assetTransfer.amount} USDC`);
      }

      await this.markAsCheckout(checkout, PaidStatus.Paid);
      await this.notification.publishTransactionStatus({
        checkoutId: checkout.id,
        step: CheckoutStep.Asset,
        status: "settled",
        paidStatus: checkout.status,
        transactionId: receipt.transactionHash,
        message: `Sent ${assetTransfer.amount} USDC`,
        date: new Date(),
      });

      await checkout.sendReceipt();
    } catch (err) {
      log.warn(
        {
          func: "processTransferAsset",
          checkoutId: checkout.id,
          err,
        },
        "Failed processTransferAsset"
      );

      assetTransfer &&
        (await assetTransfer.update({
          status: PaidStatus.Error,
        }));

      await this.markAsCheckout(checkout, PaidStatus.Error);

      await this.notification.publishTransactionStatus({
        checkoutId: checkout.id,
        status: "failed",
        paidStatus: checkout.status,
        step: CheckoutStep.Asset,
        message: assetTransfer
          ? `Failed sending ${assetTransfer.amount} USDC`
          : "Failed sending assets",
        transactionId: null,
        date: new Date(),
      });

      throw err;
    }
  }

  async getCheckoutStatus(checkout: Checkout) {
    const transaction: TransactionType = {
      checkoutId: checkout.id,
      step: CheckoutStep.Charge,
      status:
        checkout.status === PaidStatus.Paid
          ? "settled"
          : checkout.status === PaidStatus.Error
          ? "failed"
          : checkout.status,
      paidStatus: checkout.status,
      message: "",
      transactionId: null,
      date: new Date(),
    };

    const charge = await checkout.getCharge();
    const assetTransfer = await checkout.getAssetTransfer();

    if (assetTransfer) {
      transaction.step = CheckoutStep.Asset;
    } else if (charge) {
      transaction.step = CheckoutStep.Charge;
    }

    if (checkout.status === PaidStatus.Paid) {
      transaction.message = `Charged ${checkout.totalChargeAmountMoney.toFormat()}`;
    }
    if (checkout.status === PaidStatus.Paid && assetTransfer) {
      transaction.transactionId = assetTransfer?.transactionHash;
      transaction.message = "Settled transfer assets";
    } else if (checkout.status === PaidStatus.Processing) {
      transaction.message = `Processing ${transaction.step}`;
    } else if (transaction.paidStatus === PaidStatus.Error) {
      transaction.message = charge?.code
        ? `${charge.code}: ${charge.message}`
        : `Failed checkout for ${transaction.step}`;
    }

    return transaction;
  }
}
