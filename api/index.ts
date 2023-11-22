import express, { Request, Response } from "express";
require("dotenv").config();
import cors from "cors";
import models from "../src/models";
import { resError } from "../src/middleware/resError";
import { initAuth } from "../src/auth";
import { initGraphql } from "../src/graphql";
import bodyParser from "body-parser";
import { initRoutes } from "../src/routes";

const { sequelize } = models;

const bootstrap = async () => {
  const app = express();

  await sequelize.authenticate();

  app.get("/", (_req: Request, res: Response) => {
    return res.send("Coinfella api 1.0");
  });

  app.use(cors());
  app.use(resError);
  app.use(bodyParser.json());
  initAuth(app);
  initRoutes(app);
  await initGraphql(app);
  return app;
};

export default bootstrap();
