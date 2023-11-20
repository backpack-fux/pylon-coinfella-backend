import { chargeMessages } from "../errors/chargeErrors";
import { Charge } from "../models/Charge";
import { CheckoutRequest } from "../models/CheckoutRequest";
import { OrderPayload } from "../models/Partner";
import { newDinero } from "./currency";

export const convertToCharge = (charge: any): Charge => {
  const chargeAmount = newDinero(Number(charge.amount), charge.currency);
  return {
    id: charge.id,
    status: charge.status,
    amount: chargeAmount.toUnit(),
    currency: chargeAmount.getCurrency(),
    approved: charge.approved,
    flagged: charge.risk?.flagged,
    processedOn: charge.processed_on,
    reference: charge.reference,
    last4: charge.source?.last4,
    bin: charge.source?.bin,
    code: charge.response_code,
    message: chargeMessages[charge.response_code],
  } as Charge;
};

export const normalizeOrder = (
  checkoutRequest: CheckoutRequest
): OrderPayload => {
  return {
    id: checkoutRequest.id,
    walletAddress: checkoutRequest.walletAddress,
    email: checkoutRequest.email,
    phoneNumber: checkoutRequest.phoneNumber,
    status: checkoutRequest.status,
    partnerOrderId: checkoutRequest.partnerOrderId,
    transactionHash: checkoutRequest.checkout?.assetTransfer?.transactionHash,
    feeAmount: checkoutRequest.checkout?.feeAmountMoney.toUnit(),
    tipAmount: checkoutRequest.checkout?.tipAmountMoney.toUnit(),
    chargeAmount: checkoutRequest.checkout?.totalChargeAmountMoney.toUnit(),
    unitAmount: checkoutRequest.checkout?.assetTransfer?.amount,
    chargeId: checkoutRequest.checkout?.charge?.id,
    chargeCode: checkoutRequest.checkout?.charge?.code,
    chargeMsg: checkoutRequest.checkout?.charge?.message,
    chargeStatus: checkoutRequest.checkout?.charge?.status,
    last4: checkoutRequest.checkout?.charge?.last4,
    customer: {
      id: checkoutRequest.checkout?.user?.id,
      firstName:
        checkoutRequest.checkout?.user?.firstName ||
        checkoutRequest.checkout?.firstName,
      lastName:
        checkoutRequest.checkout?.user?.lastName ||
        checkoutRequest.checkout?.lastName,
      email:
        checkoutRequest.checkout?.user?.email ||
        checkoutRequest.checkout?.email,
      phoneNumber:
        checkoutRequest.checkout?.user?.phoneNumber ||
        checkoutRequest.checkout?.phoneNumber,
      ssn: checkoutRequest.checkout?.user?.ssn,
      dob: checkoutRequest.checkout?.user?.dob,
      status: checkoutRequest.checkout?.user?.status,
      streetAddress:
        checkoutRequest.checkout?.user?.streetAddress ||
        checkoutRequest.checkout?.streetAddress,
      streetAddress2:
        checkoutRequest.checkout?.user?.streetAddress2 ||
        checkoutRequest.checkout?.streetAddress2,
      city:
        checkoutRequest.checkout?.user?.city || checkoutRequest.checkout?.city,
      postalCode:
        checkoutRequest.checkout?.user?.postalCode ||
        checkoutRequest.checkout?.postalCode,
      state:
        checkoutRequest.checkout?.user?.state ||
        checkoutRequest.checkout?.state,
      country:
        checkoutRequest.checkout?.user?.country ||
        checkoutRequest.checkout?.country,
    },
  };
};
