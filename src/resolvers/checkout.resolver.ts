import { Arg, Ctx, Mutation, Query, Resolver, Root, Subscription } from "type-graphql";
import { Checkout } from "../models/Checkout";
import { CheckoutService } from "../services/checkout";
import { CheckoutInputType } from "../types/checkout-input.type";
import { CheckoutType } from "../types/checkout.type";
import { log } from "../utils";
import { User } from "../models/User";
import { PaidStatus } from "../types/paidStatus.type";

const checkoutService = CheckoutService.getInstance();

@Resolver()
export class CheckoutResolver {
  @Query(() => [CheckoutType])
  async checkouts() {
    return await Checkout.findAll();
  }

  @Query(() => CheckoutType)
  async checkout(@Arg("id") id: string) {
    const checkout = await Checkout.findByPk(id);

    if (!checkout) {
      throw new Error(`Not found checkout for ${id}`);
    }

    const transaction = await checkoutService.getCheckoutStatus(checkout);

    return {
      ...checkout.toJSON(),
      transaction
    };
  }

  @Mutation(() => CheckoutType)
  async createCheckoutWithoutUser(@Arg("data") data: CheckoutInputType) {
    log.info({
      func: "createCheckout",
      data
    });

    const totalAmount = data.amount + (data.amount * (data.tip || 0)) / 100;
    const user = data.userId && (await User.findByPk(data.userId));

    if (user && !user.isVerified) {
      throw new Error("Please process KYC before trading");
    }

    // modified for a tx to test size limit
    if (totalAmount >= 500 && !user) {
      throw new Error("Required user registration for purchasing over $500");
    }

    return checkoutService.process(data);

    //   const checkouts = await Checkout.findAll({
    //     where: {
    //       status: PaidStatus.Pending
    //     }
    //   });

    //   for (const checkout of checkouts) {
    //     try {
    //       await checkoutService.processCheckout(checkout);
    //     } catch (err) {
    //       console.log("error: ", err);
    //       throw new Error("Failed to process checkout");
    //     }
    //   }
  }

  @Mutation(() => CheckoutType)
  async createCheckout(@Ctx("user") user: any, @Arg("data") data: CheckoutInputType) {
    log.info({
      func: "createCheckout",
      data,
      user
    });

    if (!user.isVerified) {
      throw new Error("Please process KYC before trading");
    }

    return checkoutService.process(data, user);
  }
}
