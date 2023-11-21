import express, { Request, Response } from "express";
require("dotenv").config();
import cors from "cors";
import { resError } from "../src/middleware/resError";
import { initAuth } from "../src/auth";
import { initGraphql } from "../src/graphql";

const bootstrap = async () => {
  const app = express();

  // await sequelize.authenticate();

  app.get("/", (_req: Request, res: Response) => {
    return res.send("Coinfella api" + process.env.NODE_ENV);
  });

  app.use(cors());
  app.use(resError);
  initAuth(app);
  await initGraphql(app);

  return app;
};

export default bootstrap();
