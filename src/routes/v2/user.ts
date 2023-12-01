import { Config } from "../../config";

// MODULES
import * as express from "express";

import { authMiddlewareForPartner } from "../../middleware/auth";

import { User } from "../../models/User";

import { log } from "../../utils";
import { check } from "express-validator";

const router = express.Router();

router.patch("/v2/users/:id", authMiddlewareForPartner, async (req, res) => {
  const partner = req.partner;
  const id = req.params.id;
  const data = req.body;

  log.info(
    {
      func: "PATCH: /users/orders",
      partnerId: partner?.id,
      id,
      data,
    },
    "Start updating user"
  );
  try {
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error(`Can\'t find a user for ID: ${id}`);
    }

    await user.update({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      streetAddress: data.streetAddress,
      streetAddress2: data.streetAddress2,
      city: data.city,
      state: data.state,
      ssn: data.ssn,
      dob: data.dob,
    });

    await user.sendWebhook("update");

    res.status(200).send(user.toJSON());
  } catch (error) {
    log.info(
      {
        func: "PATCH: /users/orders",
        partnerId: partner?.id,
        id,
        data,
      },
      "Failed Update Partner"
    );

    if (error.code) {
      return res.status(400).send(error);
    }

    res.status(400).send({
      message: error.message || "Error",
    });
  }
});

router.get("/v2/users/:id", authMiddlewareForPartner, async (req, res) => {
  const partner = req.partner;
  const id = req.params.id;

  log.info(
    {
      func: "GET: /users/orders",
      userId: id,
      partnerId: partner?.id,
    },
    "Start get partner orders"
  );

  try {
    await check("email", "Email is invalid").optional().isEmail().run(req);
    await check("phoneNumber", "Phone number is invalid")
      .optional()
      .isMobilePhone("en-US")
      .run(req);

    const user = await User.findByPk(id);

    if (!user) {
      throw new Error(`Can\'t find a user for ID: ${id}`);
    }

    res.status(200).json(user.toJSON());
  } catch (error) {
    log.warn(
      {
        func: "GET: /users/orders",
        userId: id,
        partnerId: partner?.id,
        err: error,
      },
      "Failed get user"
    );

    if (error.code) {
      return res.status(400).send(error);
    }

    if (error.mapped && error.mapped()) {
      return res.status(422).send({
        message: "Failed validation",
        errors: error.mapped(),
      });
    }

    res.status(400).send({
      message: error.message || "Error",
    });
  }
});

export = router;
