import { PubSub } from "graphql-subscriptions";
import Container from "typedi";

Container.set("pubsub", new PubSub());
