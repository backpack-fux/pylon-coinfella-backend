import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
require('dotenv').config();

const sequelizeConfig: SequelizeOptions = require('../sequelize/config');
import { IDbModels } from './models';

const sequelize = new Sequelize(sequelizeConfig);

type ISequelize = IDbModels & { sequelize: Sequelize };
const db = <ISequelize>(<unknown>sequelize.models);

db.sequelize = sequelize;

export default db;
