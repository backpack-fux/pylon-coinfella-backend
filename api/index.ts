import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { initAuth } from "../src/auth";
import { initGraphql } from "../src/graphql";
import { resError } from "../src/middleware/resError";
import models from "../src/models";
import { initRoutes } from "../src/routes";
require("dotenv").config();

const { sequelize } = models;

const bootstrap = async () => {
  const app = express();

  await sequelize.authenticate();

  app.get("/", (_req: Request, res: Response) => {
    return res.send({ "BP1 API": "v1.0" });
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
