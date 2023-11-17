"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
require('dotenv').config();
const sequelizeConfig = require('../sequelize/config');
const sequelize = new sequelize_typescript_1.Sequelize(sequelizeConfig);
const db = sequelize.models;
db.sequelize = sequelize;
exports.default = db;
//# sourceMappingURL=index.js.map