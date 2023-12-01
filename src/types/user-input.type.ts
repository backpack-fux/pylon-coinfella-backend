import { IsNumber, isNumber, IsOptional, IsString } from "class-validator";
import { Field, InputType } from "type-graphql";
import { TipType } from "./tip.type";

@InputType()
export class UserInputType {
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

  @IsString()
  @Field({ nullable: true })
  password!: string;

  @IsString()
  @Field()
  gender!: string;

  @IsString()
  @Field()
  dob!: string;

  @IsString()
  @Field()
  ssn!: string;

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
  @Field()
  country: string;

  @IsString()
  @Field()
  signedAgreementId: string;

  @IsString()
  @Field({ nullable: true })
  externalUserId: string;

  @IsString()
  @Field({ nullable: true })
  partnerId: string;
}
