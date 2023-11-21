import "reflect-metadata";
import "./models";
require("dotenv").config();

import express from "express";
import * as bodyParser from "body-parser";
import models from "./models";
import cors from "cors";
import {
  checkForMigrations,
  performMigrations,
  performSeeds,
} from "./sequelize/helpers/migrations";
import { log } from "./utils";
import { initRoutes } from "./routes";
import { initGraphql } from "./graphql";
import { createServer } from "http";
import { initAuth } from "./auth";
import { resError } from "./middleware/resError";
import { exec } from "child_process";

const runMigrations = async () => {
  return new Promise((resolve, reject) => {
    exec("yarn sequelize db:migrate", (err, stdout, stderr) => {
      if (err) {
        console.log("========== failed run migrations ===============");
        console.log(err);
        return reject(err);
      }
      console.log(stdout);
      console.log(stderr);

      console.log("========== finished migrations ===============");

      exec("yarn sequelize db:seed:all", (err2, stdout2, stderr2) => {
        if (err2) {
          console.log("========== failed run seeds ===============");
          console.log(err2);
          return reject(err2);
        }

        console.log(stdout2);
        console.log(stderr2);

        console.log("========== finished seeds ===============");
        resolve(true);
      });
    });
  });
};

const { sequelize } = models;

async function bootstrap() {
  try {
    await sequelize.authenticate();
  } catch (err) {
    log.warn(
      {
        err,
      },
      "Unable to connect to the database"
    );
  }
  log.info("Sequelize Database Connected");

  const app = express();
  const httpServer = createServer(app);
  app.use(cors());
  app.use(resError);
  app.use(bodyParser.json());
  initAuth(app);
  initRoutes(app);
  await initGraphql(app);

  const port = process.env.PORT || 4000;

  httpServer.listen(port, () => {
    log.info(`Server running at http://localhost:${port}`);
  });
}

bootstrap();
