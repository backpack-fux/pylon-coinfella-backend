import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  phoneNumber: string;

  @Field()
  gender: string;

  @Field()
  dob: string;

  @Field()
  ssn: string;

  @Field()
  streetAddress: string;

  @Field()
  streetAddress2: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  postalCode: string;

  @Field({ nullable: true })
  country: string;

  @Field()
  isVerified: boolean;

  @Field()
  token: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;
}
