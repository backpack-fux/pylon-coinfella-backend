import { IsNumber, isNumber, IsOptional, IsString } from "class-validator";
import { Field, InputType } from "type-graphql";
import { TipType } from "./tip.type";

@InputType()
export class CheckoutInputType {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  checkoutRequestId!: string;

  @IsString()
  @Field()
  checkoutTokenId: string;

  @IsString()
  @Field()
  walletAddress: string;

  @IsString()
  @Field()
  firstName: string;

  @IsString()
  @Field()
  lastName: string;

  @IsString()
  @Field()
  email: string;

  @IsString()
  @Field()
  phoneNumber: string;

  @IsNumber()
  @Field()
  amount: number;

  @IsNumber()
  @Field()
  tip: number;

  @IsString()
  @Field()
  tipType: TipType;

  @IsNumber()
  @Field({ nullable: true })
  fee!: number;

  @Field({ nullable: true })
  feeType!: string;

  @IsNumber()
  @Field()
  feeMethod: number;

  @IsString()
  @Field()
  streetAddress: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  streetAddress2: string;

  @IsString()
  @Field()
  city: string;

  @IsString()
  @Field()
  state: string;

  @IsString()
  @Field()
  postalCode: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  country: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  userId!: string;
}
