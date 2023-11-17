import { Field, ID, ObjectType } from "type-graphql";
import { TransactionType } from "./transaction.type";

@ObjectType()
export class CheckoutType {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  checkoutRequestId!: string;

  @Field()
  walletAddress: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  phoneNumber: string;

  @Field()
  currency: string;

  @Field()
  amount: number;

  @Field()
  fee: number;

  @Field()
  feeType: string;

  @Field()
  feeMethod: number;

  @Field()
  tip: number;

  @Field()
  tipType: string;

  @Field()
  streetAddress: string;

  @Field({ nullable: true })
  streetAddress2: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  postalCode: string;

  @Field({ nullable: true })
  country: string;

  @Field({ nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;

  @Field(type => TransactionType, { nullable: true, description: 'transaction' })
  transaction: TransactionType
}