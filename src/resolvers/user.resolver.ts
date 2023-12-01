import { v4 as uuidv4 } from "uuid";
import { Resolver, Query, Arg, Mutation, Authorized, Ctx } from "type-graphql";
import { log } from "../utils";
import { UserType } from "../types/user.type";
import { UserInputType } from "../types/user-input.type";
import { User } from "../models/User";
import { BridgeService } from "../services/bridgeService";
import { AgreementLink } from "../models/AgreementLink";
import { KycLink } from "../models/KycLink";
import { UserService } from "../services/userService";
import { Config } from "../config";
import { UserStatus } from "../types/userStatus.type";
import { TosStatus } from "../types/tosStatus.type";
import { Partner } from "../models/Partner";

const bridgeService = BridgeService.getInstance();

const syncUser = async (user: User) => {
  const res = await bridgeService.getCustomer(user.id);
  const userStatus = user.status;
  const kycLink = await KycLink.findOne({
    where: {
      userId: user.id,
    },
  });

  if (kycLink) {
    await kycLink.update({
      kycStatus: res.status,
    });
  }

  await user.update({
    status: res.status,
    requirementsDue: res.requirements_due,
    futureRequirementsDue: res.future_requirements_due,
  });

  if (userStatus === res.status) {
    return;
  }

  await user.sendWebhook("update");
};

@Resolver()
export class UserResolver {
  @Query(() => UserType)
  @Authorized()
  async me(@Ctx("user") user: any) {
    const userRecord = await User.findByPk(user.id);

    if (!userRecord.isVerified) {
      await syncUser(userRecord);
    }

    return userRecord;
  }

  @Query(() => UserType, { nullable: true })
  async user(@Arg("userId") userId: string) {
    return User.findByPk(userId);
  }

  @Query(() => String)
  async agreementLink() {
    const idempotenceId = uuidv4();

    const link = await bridgeService.createTermsOfServiceUrl(idempotenceId);

    await AgreementLink.create({
      id: idempotenceId,
      link,
    });

    return link;
  }

  @Mutation(() => UserType)
  async createUser(@Arg("data") data: UserInputType) {
    log.info({
      func: "createUser",
      data,
    });

    const existingUserEmail = await User.findOne({
      where: {
        email: data.email,
      },
    });

    if (existingUserEmail) {
      throw new Error(`Already exists account with email: ${data.email}`);
    }

    const existingUserPhoneNumber = await User.findOne({
      where: {
        phoneNumber: data.phoneNumber,
      },
    });

    if (existingUserPhoneNumber) {
      throw new Error(
        `Already exists account with phone number: ${data.phoneNumber}`
      );
    }

    if (data.partnerId) {
      const partner = await Partner.findByPk(data.partnerId);

      if (!partner) {
        throw new Error(
          `Not found partner with provided ID: ${data.partnerId}`
        );
      }
    }

    const idempotenceId = uuidv4();

    const res = await bridgeService.createCustomer(
      {
        type: "individual",
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phoneNumber,
        address: {
          street_line_1: data.streetAddress,
          street_line_2: data.streetAddress2,
          city: data.city,
          state: data.state,
          postal_code: data.postalCode,
          country: data.country,
        },
        birth_date: data.dob,
        tax_identification_number: data.ssn,
        signed_agreement_id: data.signedAgreementId,
      },
      idempotenceId
    );

    const user = await User.create({
      id: res.id,
      status: Config.isProduction ? res.status : "pending",
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      dob: data.dob,
      ssn: data.ssn,
      password: data.password,
      streetAddress: data.streetAddress,
      streetAddress2: data.streetAddress2,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      requirementsDue: res.requirements_due,
      futureRequirementsDue: res.future_requirements_due,
      signedAgreementId: data.signedAgreementId,
      idempotenceId,
      externalUserId: data.externalUserId,
      partnerId: data.partnerId,
    });

    await user.sendWebhook("create");

    const token = user.password
      ? UserService.generateJWTToken({
          id: user.id,
          email: user.email,
        })
      : "";

    return {
      ...user.toJSON(),
      isVerified: user.isVerified,
      token,
    };
  }

  @Authorized()
  @Query(() => String)
  async kycLink(@Ctx("user") user: User) {
    if (Config.isProduction) {
      const link = await bridgeService.createKycUrl(
        user.id,
        `${Config.frontendUri}/kyc-success`
      );

      await KycLink.create({
        userId: user.id,
        associatedObjectType: "user",
        associatedUserType: "user",
        email: user.email,
        customerId: user.id,
        kycLink: link,
        type: "individual",
        tosStatus: TosStatus.Approved,
      });

      return link;
    } else {
      return `${Config.frontendUri}/kyc-success`;
    }
  }

  @Query(() => String)
  async userKycLink(@Arg("userId") userId: string) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("Not found user");
    }

    const link = Config.isProduction
      ? await bridgeService.createKycUrl(
          user.id,
          `${Config.frontendUri}/kyc-success?userId=${userId}`
        )
      : `${Config.frontendUri}/kyc-success?userId=${userId}`;

    await KycLink.create({
      userId: user.id,
      associatedObjectType: "user",
      associatedUserType: "user",
      email: user.email,
      customerId: user.id,
      kycLink: link,
      type: "individual",
      tosStatus: TosStatus.Approved,
    });

    return link;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async kycCompleted(@Ctx("user") user: User) {
    const userRecord = await User.findByPk(user.id);

    if (!Config.isProduction) {
      await userRecord.update({
        status: UserStatus.Active,
        requirementsDue: [],
        futureRequirementsDue: [],
      });
      await user.sendWebhook("update");
    } else {
      await syncUser(userRecord);
    }

    return true;
  }

  @Mutation(() => Boolean)
  async userKycCompleted(@Arg("userId") userId: string) {
    const userRecord = await User.findByPk(userId);

    if (!Config.isProduction) {
      await userRecord.update({
        status: UserStatus.Active,
        requirementsDue: [],
        futureRequirementsDue: [],
      });
    } else {
      await syncUser(userRecord);
    }

    return true;
  }
}
