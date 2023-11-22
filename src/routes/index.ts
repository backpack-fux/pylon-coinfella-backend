// Dependencies
import * as express from "express";
import job from "./job";
import user from "./user";
import partner from "./v2/partner";
import partnerUser from "./v2/user";

export const initRoutes = async (app: express.Application) => {
  app.use("/", job);
  app.use("/", user);
  app.use("/", partner);
  app.use("/", partnerUser);
};
