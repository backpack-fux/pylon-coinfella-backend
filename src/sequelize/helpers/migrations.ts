import { Umzug, SequelizeStorage } from 'umzug';

import models from '../../models';
const { sequelize } = models;

export const checkForMigrations = () => {
  const umzug = new Umzug({
    migrations: { glob: 'src/sequelize/migrations/*.js' },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  return umzug.pending();
};

export const performMigrations = () => {
  const umzug = new Umzug({
    migrations: { glob: 'src/sequelize/migrations/*.js' },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  return umzug.up();
};
