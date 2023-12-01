import * as moment from "moment-timezone";
import { KycLink } from "../models/KycLink";
import { Op } from "sequelize";
import { UserStatus } from "../types/userStatus.type";
import { TosStatus } from "../types/tosStatus.type";
import { BridgeService } from "./bridgeService";
import { User } from "../models/User";
import { Partner } from "../models/Partner";
import { NotificationService } from "./notificationService";
import { UserService } from "./userService";
import { log } from "../utils";
import { Config } from "../config";

const notificationService = NotificationService.getInstance();
const bridgeServiceInstance = BridgeService.getInstance();

export class KycService {
  constructor(
    private bridgeService: BridgeService,
    private notificationService: NotificationService
  ) {}
  static getInstance() {
    return new KycService(bridgeServiceInstance, notificationService);
  }

  private async getKycLinks10Minutes() {
    return KycLink.findAll({
      where: {
        createdAt: {
          [Op.gte]: moment.utc().subtract(10, "minutes").toDate(),
        },
        [Op.or]: [
          {
            kycStatus: { [Op.notIn]: [UserStatus.Active, UserStatus.Rejected] },
          },
          {
            tosLink: TosStatus.Pending,
          },
        ],
      },
    });
  }

  private async getKycLinksInAnHour() {
    return KycLink.findAll({
      where: {
        createdAt: {
          [Op.lt]: moment.utc().subtract(10, "minutes").toDate(),
          [Op.gte]: moment.utc().subtract(1, "hour").toDate(),
        },
        [Op.or]: [
          {
            kycStatus: { [Op.notIn]: [UserStatus.Active, UserStatus.Rejected] },
          },
          {
            tosLink: TosStatus.Pending,
          },
        ],
      },
    });
  }

  private async getKycLinksIn2Days() {
    return KycLink.findAll({
      where: {
        createdAt: {
          [Op.lt]: moment.utc().subtract(1, "hour").toDate(),
          [Op.gte]: moment.utc().subtract(2, "day").toDate(),
        },
        [Op.or]: [
          {
            kycStatus: { [Op.notIn]: [UserStatus.Active, UserStatus.Rejected] },
          },
          {
            tosLink: TosStatus.Pending,
          },
        ],
      },
    });
  }

  private async getKycLinksIn10Days() {
    return KycLink.findAll({
      where: {
        createdAt: {
          [Op.lt]: moment.utc().subtract(2, "day").toDate(),
          [Op.gte]: moment.utc().subtract(10, "days").toDate(),
        },
        [Op.or]: [
          {
            kycStatus: { [Op.notIn]: [UserStatus.Active, UserStatus.Rejected] },
          },
          {
            tosLink: TosStatus.Pending,
          },
        ],
      },
    });
  }

  async syncKycIn10Minutes() {
    const kycLinks = await this.getKycLinks10Minutes();

    await this.syncKycLinks(kycLinks);
  }

  async syncKycInAnHour() {
    const kycLinks = await this.getKycLinksInAnHour();

    await this.syncKycLinks(kycLinks);
  }

  async syncKycIn2Days() {
    const kycLinks = await this.getKycLinksIn2Days();

    await this.syncKycLinks(kycLinks);
  }

  async syncKycIn10Days() {
    const kycLinks = await this.getKycLinksIn10Days();

    await this.syncKycLinks(kycLinks);
  }

  private async syncKycLinks(kycLinks: KycLink[]) {
    if (!kycLinks.length) {
      return;
    }

    log.info(
      {
        func: "syncKycLinks",
        kycLinkIds: kycLinks.map((link) => link.id),
      },
      "syncKycLinks Start"
    );

    for (let i = 0; i < kycLinks.length; i += 1) {
      const kycLink = await kycLinks[i];

      try {
        await this.syncKyc(kycLink);
      } catch (err) {
        log.warn(
          {
            func: "syncKycLinks",
            kycLinkId: kycLink.id,
          },
          "syncKycLinks Error"
        );
      }
    }
  }

  private async syncKyc(kycLink: KycLink) {
    if (kycLink.associatedObjectType === "user") {
      if (kycLink.associatedUserType === "user") {
        return this.syncUserByCustomer(kycLink);
      }

      return this.syncUserByKycLink(kycLink);
    }

    if (kycLink.associatedUserType === "user") {
      return this.syncPartnerByCustomer(kycLink);
    }

    return this.syncPartnerByKycLink(kycLink);
  }

  private async syncUserByCustomer(kycLink: KycLink) {
    if (!kycLink.customerId) {
      return;
    }

    const user = await User.findByPk(kycLink.userId);

    if (!user) {
      return;
    }

    const userStatus = user.status;

    if (Config.isProduction) {
      const res = await this.bridgeService.getCustomer(kycLink.customerId);

      await user.sequelize.transaction(async (t) => {
        await user.update(
          {
            status: res.status,
            requirementsDue: res.requirements_due,
            futureRequirementsDue: res.future_requirements_due,
          },
          { transaction: t }
        );

        await kycLink.update(
          {
            kycStatus: res.status,
          },
          { transaction: t }
        );
      });
    } else {
      await user.sequelize.transaction(async (t) => {
        await user.update(
          {
            status: UserStatus.Active,
          },
          { transaction: t }
        );

        await kycLink.update(
          {
            kycStatus: UserStatus.Active,
          },
          { transaction: t }
        );
      });
    }

    if (userStatus === user.status) {
      return;
    }

    await user.sendWebhook("update");

    await this.notificationService.publishUserStatus({
      userId: user.id,
      status: user.state,
      token: UserService.generateJWTToken({
        id: user.id,
        email: user.email,
      }),
      error: "",
    });
  }

  private async syncUserByKycLink(kycLink: KycLink) {
    const user = await User.findByPk(kycLink.userId);

    if (!user) {
      return;
    }

    const userStatus = user.status;

    await user.sequelize.transaction(async (t) => {
      const kycLinkRes = await this.bridgeService.getKycLink(kycLink.id);

      await kycLink.update(
        {
          kycStatus: kycLinkRes.kyc_status,
          tosStatus: kycLinkRes.tos_status,
        },
        { transaction: t }
      );

      if (kycLinkRes.customer_id) {
        const customer = await this.bridgeService.getCustomer(
          kycLinkRes.customer_id
        );

        await user.update(
          {
            status: customer.status,
            requirementsDue: customer.requirements_due,
            futureRequirementsDue: customer.future_requirements_due,
          },
          { transaction: t }
        );
      }
    });

    if (userStatus === user.status) {
      return;
    }

    await user.sendWebhook("update");

    await this.notificationService.publishUserStatus({
      userId: user.id,
      status: user.state,
      token: UserService.generateJWTToken({
        id: user.id,
        email: user.email,
      }),
      error: "",
    });
  }

  private async syncPartnerByCustomer(kycLink: KycLink) {
    if (!kycLink.customerId) {
      return;
    }

    const partner = await Partner.findByPk(kycLink.userId);

    if (!partner) {
      return;
    }
    const partnerStatus = partner.status;
    const res = await this.bridgeService.getCustomer(kycLink.customerId);

    await partner.sequelize.transaction(async (t) => {
      await partner.update(
        {
          status: res.status,
        },
        { transaction: t }
      );

      await kycLink.update(
        {
          kycStatus: res.status,
        },
        { transaction: t }
      );
    });

    if (partner.status === partnerStatus) {
      return;
    }

    await partner.sendWebhook(partner.id, "account", "update", {
      id: partner.id,
      firstName: partner.firstName,
      lastName: partner.lastName,
      email: partner.email,
      phoneNumber: partner.phoneNumber,
      ssn: partner.ssn,
      dob: partner.dob,
      status: partner.status,
      streetAddress: partner.streetAddress,
      streetAddress2: partner.streetAddress2,
      city: partner.city,
      postalCode: partner.postalCode,
      state: partner.state,
      country: partner.country,
    });
  }

  private async syncPartnerByKycLink(kycLink: KycLink) {
    const partner = await Partner.findByPk(kycLink.userId);

    if (!partner) {
      return;
    }

    const partnerStatus = partner.status;
    await partner.sequelize.transaction(async (t) => {
      const kycLinkRes = await this.bridgeService.getKycLink(kycLink.id);

      await kycLink.update(
        {
          kycStatus: kycLinkRes.kyc_status,
          tosStatus: kycLinkRes.tos_status,
        },
        { transaction: t }
      );

      if (kycLinkRes.customer_id) {
        const customer = await this.bridgeService.getCustomer(
          kycLinkRes.customer_id
        );

        await partner.update(
          {
            status: customer.status,
          },
          { transaction: t }
        );
      }
    });

    if (partner.status === partnerStatus) {
      return;
    }

    await partner.sendWebhook(partner.id, "account", "update", {
      id: partner.id,
      firstName: partner.firstName,
      lastName: partner.lastName,
      email: partner.email,
      phoneNumber: partner.phoneNumber,
      ssn: partner.ssn,
      dob: partner.dob,
      status: partner.status,
      streetAddress: partner.streetAddress,
      streetAddress2: partner.streetAddress2,
      city: partner.city,
      postalCode: partner.postalCode,
      state: partner.state,
      country: partner.country,
    });
  }
}
