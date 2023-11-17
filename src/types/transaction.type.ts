import { Field, ID, ObjectType } from "type-graphql";
import { CheckoutStep } from "./checkoutStep.type";
import { PaidStatus } from "./paidStatus.type";

@ObjectType()
export class TransactionType {
  @Field()
  checkoutId: string;

  @Field()
  step: CheckoutStep;

  @Field()
  status: string;

  @Field()
  paidStatus: PaidStatus;

  @Field()
  message: string;

  @Field({ nullable: null })
  transactionId!: string;

  @Field()
  date: Date;
}