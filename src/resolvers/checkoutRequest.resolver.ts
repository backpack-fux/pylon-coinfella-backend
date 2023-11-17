import { Resolver, Query, Arg, Mutation, Authorized } from 'type-graphql';
import { CheckoutType } from '../types/checkout.type';
import { log } from '../utils';
import { CheckoutRequest } from '../models/CheckoutRequest';
import { CheckoutRequestType } from '../types/checkoutRequest.type';
import { CheckoutRequestInputType } from '../types/checkoutRequest-input.type';
import { PaidStatus } from '../types/paidStatus.type';
import { Checkout } from '../models/Checkout';
import { CheckoutService } from '../services/checkout';

const checkoutService = CheckoutService.getInstance()

@Resolver()
export class CheckoutRequestResolver {
  @Query(() => CheckoutRequestType)
  async checkoutRequest(@Arg('id') id: string) {
    const checkoutRequest = await CheckoutRequest.findByPk(id, {
      include: [{
        model: Checkout,
      }]
    });

    if (!checkoutRequest) {
      throw new Error(`Not found checkout request for ${id}`)
    }

    const data = checkoutRequest.toJSON() as unknown as CheckoutRequestType

    if (checkoutRequest.checkout) {
      const transaction = await checkoutService.getCheckoutStatus(checkoutRequest.checkout)

      data.checkout.transaction = transaction
    }

    return data
  }

  @Mutation(() => CheckoutType)
  async createCheckoutRequest(
    @Arg('data') data: CheckoutRequestInputType,
  ) {
    log.info({
      func: 'createCheckoutRequest',
      data
    })


    const checkoutRequest = await CheckoutRequest.create(data);

    return checkoutRequest
  }
}
