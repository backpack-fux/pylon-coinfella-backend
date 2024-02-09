const path = require('path');
require('dotenv').config();

const config = {
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  charset: 'utf8',
  collate: 'utf8_general_ci',
  dialect: 'postgres',
  dialectOptions: process.env.NODE_ENV === 'development' ? undefined : {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
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
