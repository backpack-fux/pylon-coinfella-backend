import { IsNumber, IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CheckoutRequestInputType {
  @IsString()
  @Field()
  walletAddress: string;

  @IsString()
  @Field({ nullable: true })
  email!: string;

  @IsString()
  @Field()
  phoneNumber: string;

  @IsNumber()
  @Field()
  amount: number;

  @Field({ nullable: true })
  partnerOrderId!: string;
}