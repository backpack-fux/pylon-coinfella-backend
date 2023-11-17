"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGraphql = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const typedi_1 = require("typedi");
const _ = __importStar(require("lodash"));
const config_1 = require("./config");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const auth_1 = require("./middleware/auth");
const authChecker_1 = require("./auth/authChecker");
const context = ({ req, connection }) => {
    if (connection) {
        return connection.context;
    }
    return {
        user: _.get(req, "user"),
    };
};
const initGraphql = async (app, httpServer) => {
    let resolversPattern = [
        `${__dirname}/resolvers/*.resolver.js`,
    ];
    if (!config_1.Config.isProduction && !config_1.Config.isStaging) {
        resolversPattern = [`${__dirname}/resolvers/*.resolver.ts`];
    }
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: resolversPattern,
        authChecker: authChecker_1.customAuthChecker,
        container: typedi_1.Container,
    });
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        context,
        plugins: [
            // Proper shutdown for the HTTP server.
            // @ts-ignore
            (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
        ],
    });
    await server.start();
    app.use("/graphql", auth_1.authMiddlewareForGraphql);
    server.applyMiddleware({ app });
};
exports.initGraphql = initGraphql;
//# sourceMappingURL=graphql.js.map