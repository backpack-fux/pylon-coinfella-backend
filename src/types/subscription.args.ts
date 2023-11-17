import { GraphQLJSONObject } from "graphql-type-json";
import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class SubscriptionArgs {
  @Field()
  id: string;

  @Field()
  type: string;

  @Field()
  action: string;

  @Field((type) => GraphQLJSONObject)
  payload: object;
}
