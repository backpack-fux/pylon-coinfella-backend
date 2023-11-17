// TS_NODE_FILES=true node_modules/.bin/ts-node src/scripts/migrateKycLinks.ts

// models
import "../models";

import { KycLink } from "../models/KycLink";
import { Partner } from "../models/Partner";
import { User } from "../models/User";
import { TosStatus } from "../types/tosStatus.type";

export const migrateKycLink = async (kycLink: KycLink) => {
  const user = await User.findByPk(kycLink.userId);

  if (user) {
    return kycLink.update({
      associatedObjectType: "user",
      associatedUserType: "user",
      customerId: kycLink.userId,
      kycStatus: user.status,
      email: user.email,
      tosStatus: TosStatus.Approved,
    });
  }

  const partner = await Partner.findByPk(kycLink.userId);

  if (!partner) {
    return;
  }

  return kycLink.update({
    associatedObjectType: "user",
    associatedUserType: "partner",
    customerId: kycLink.userId,
    kycStatus: partner.status,
    email: partner.email,
    tosStatus: TosStatus.Approved,
  });
};

const migrateKycLinks = async () => {
  const kycLinks = await KycLink.findAll();

  for (const kycLink of kycLinks) {
    await migrateKycLink(kycLink);
  }
};

(async () => {
  try {
    await migrateKycLinks();
  } catch (err: any) {
    console.log("migrateKycLinks", err);
  }

  process.exit(0);
})();
