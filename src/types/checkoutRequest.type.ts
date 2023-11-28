import { Field, ID, ObjectType } from "type-graphql";
import { CheckoutType } from "./checkout.type";

@ObjectType()
export class CheckoutRequestType {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  partnerOrderId!: string;

  @Field()
  walletAddress: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  email!: string;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field()
  amount: number;

  @Field()
  fee: number;

  @Field()
  feeType: string;

  @Field()
  feeMethod: number;

  @Field()
  status: string;

  @Field({ nullable: true })
  streetAddress: string;

  @Field({ nullable: true })
  streetAddress2: string;

  @Field({ nullable: true })
  city: string;

  @Field({ nullable: true })
  state: string;

  @Field({ nullable: true })
  postalCode: string;

  @Field({ nullable: true })
  country: string;

  @Field({ nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;

  @Field((type) => CheckoutType, { nullable: true, description: "checkout" })
  checkout: CheckoutType;
}
