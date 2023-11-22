// MODULES
import * as express from "express";
import { CheckoutService } from "../services/checkout";
import { Checkout } from "../models/Checkout";
import { PaidStatus } from "../types/paidStatus.type";
import { log } from "../utils";
import { KycService } from "../services/kycService";

const checkoutService = CheckoutService.getInstance();
const kycService = KycService.getInstance();

const router = express.Router();

router.get("/jobs/processCheckoutWorker", async (req, res) => {
  try {
    const checkouts = await Checkout.findAll({
      where: {
        status: PaidStatus.Pending,
      },
    });

    const result = {
      success: [],
      failed: [],
    };

    for (const checkout of checkouts) {
      try {
        await checkoutService.processCheckout(checkout);

        result.success.push(checkout.id);
      } catch (err) {
        log.warn(
          {
            func: "/jobs/processCheckoutWorker",
            checkoutId: checkout.id,
          },
          "Failed process checkout"
        );
        result.failed.push(checkout.id);
      }
    }

    log.info(
      {
        func: "/jobs/processCheckoutWorker",
        result,
      },
      "Checkout Info"
    );

    return res.status(200).json({
      result,
    });
  } catch (err) {
    log.warn(
      {
        func: "/jobs/processCheckoutWorker",
        err,
      },
      "failed sync"
    );

    res.status(400).send({
      message: err.message || "Error",
    });
  }
});

router.get("/jobs/kyc10MinutesWorker", async (req, res) => {
  try {
    await kycService.syncKycIn10Minutes();

    return res.status(200).json({
      message: "synced",
    });
  } catch (err) {
    log.warn(
      {
        func: "/jobs/kyc10MinutesWorker",
        err,
      },
      "failed sync"
    );

    res.status(400).send({
      message: err.message || "Error",
    });
  }
});

router.get("/jobs/syncKycInAnHour", async (req, res) => {
  try {
    await kycService.syncKycInAnHour();

    return res.status(200).json({
      message: "synced",
    });
  } catch (err) {
    log.warn(
      {
        func: "/jobs/syncKycInAnHour",
        err,
      },
      "failed sync"
    );

    res.status(400).send({
      message: err.message || "Error",
    });
  }
});

router.get("/jobs/syncKycIn2Days", async (req, res) => {
  try {
    await kycService.syncKycIn2Days();

    return res.status(200).json({
      message: "synced",
    });
  } catch (err) {
    log.warn(
      {
        func: "/jobs/syncKycIn2Days",
        err,
      },
      "failed sync"
    );

    res.status(400).send({
      message: err.message || "Error",
    });
  }
});

router.get("/jobs/syncKycIn10Days", async (req, res) => {
  try {
    await kycService.syncKycIn10Days();

    return res.status(200).json({
      message: "synced",
    });
  } catch (err) {
    log.warn(
      {
        func: "/jobs/syncKycIn10Days",
        err,
      },
      "failed sync"
    );

    res.status(400).send({
      message: err.message || "Error",
    });
  }
});

export = router;
