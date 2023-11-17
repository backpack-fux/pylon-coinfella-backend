import "reflect-metadata";
import './models'
require('dotenv').config();

import express from "express";
import * as bodyParser from 'body-parser';
import models from './models';
import cors from 'cors';
import { checkForMigrations } from "./sequelize/helpers/migrations";
import { log } from "./utils";
import { initRoutes } from "./routes";
import { initGraphql } from "./graphql";
import { createServer } from "http";
import { initAuth } from "./auth";
import { resError } from "./middleware/resError";
const { sequelize } = models;

async function bootstrap() {
  try {
    await sequelize.authenticate();

    const migrations = await checkForMigrations();
    if (migrations.length) {
      console.log(
        'Pending migrations need to be run:\n',
        migrations.map((migration) => migration.name).join('\n '),
        '\nUse this command to run migrations:\n yarn sequelize db:migrate',
      );

      process.exit(1);
    }

    log.info('Database connection has been established successfully.');
  } catch (err) {
    log.warn({
      err,
    }, 'Unable to connect to the database');
  }
  log.info('Sequelize Database Connected');

  const app = express();
  const httpServer = createServer(app);
  app.use(cors())
  app.use(resError);
  app.use(bodyParser.json());
  initAuth(app)
  initRoutes(app);
  await initGraphql(app, httpServer)

  const port = process.env.PORT;

  httpServer.listen(port, () => {
    log.info(`Server running at http://localhost:${port}`);
  });
}

bootstrap();