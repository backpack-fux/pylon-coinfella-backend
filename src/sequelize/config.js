const path = require('path');
require('dotenv').config();

const config = {
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  charset: 'utf8',
  collate: 'utf8_general_ci',
  dialect: 'mysql',
  dialectOptions: {
    decimalNumbers: true,
  },
  pool: {
    max: 100,
    min: 0,
    idle: 10000,
    acquire: 60000,
    evict: 10000,
  },
  seederStorage: 'sequelize',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  freezeTableName: true, // By default, sequelize will pluralize model names
  timestamps: true,
  models: [path.resolve(__dirname, '..', 'models', '!(index.*)')],
};

module.exports = config;
