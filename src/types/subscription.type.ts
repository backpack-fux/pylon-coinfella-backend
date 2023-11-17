import { Field, ObjectType } from "type-graphql";
import { GraphQLJSONObject } from "graphql-type-json";

@ObjectType()
export class SubscriptionType {
  @Field()
  id: string;

  @Field()
  type: string;

  @Field()
  action: string;

  @Field(() => GraphQLJSONObject)
  payload: object;
}
