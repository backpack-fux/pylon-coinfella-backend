"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performSeeds = exports.performMigrations = exports.checkForMigrations = void 0;
const umzug_1 = require("umzug");
const models_1 = __importDefault(require("../../models"));
const { sequelize } = models_1.default;
const checkForMigrations = () => {
    const umzug = new umzug_1.Umzug({
        migrations: { glob: "src/sequelize/migrations/*.js" },
        context: sequelize.getQueryInterface(),
        storage: new umzug_1.SequelizeStorage({ sequelize }),
        logger: console,
    });
    return umzug.pending();
};
exports.checkForMigrations = checkForMigrations;
const performMigrations = () => {
    const umzug = new umzug_1.Umzug({
        migrations: { glob: "src/sequelize/migrations/*.js" },
        context: sequelize.getQueryInterface(),
        storage: new umzug_1.SequelizeStorage({ sequelize }),
        logger: console,
    });
    return umzug.up();
};
exports.performMigrations = performMigrations;
const performSeeds = () => {
    const umzug = new umzug_1.Umzug({
        migrations: { glob: "src/sequelize/seeders/*.js" },
        context: sequelize.getQueryInterface(),
        storage: new umzug_1.SequelizeStorage({ sequelize }),
        logger: console,
    });
    return umzug.up();
};
exports.performSeeds = performSeeds;
//# sourceMappingURL=migrations.js.map