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
exports.initRoutes = void 0;
// Dependencies
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const walkSync = (dir, filelistParam = []) => {
    let filelist = filelistParam;
    fs.readdirSync(dir).forEach((file) => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? walkSync(path.join(dir, file), filelist)
            : filelist.concat(path.join(dir, file));
    });
    return filelist;
};
// Get the array of file paths
const fileList = walkSync(__dirname);
const filterTypes = (filePath) => {
    return filePath.endsWith('.ts') || filePath.endsWith('.js');
};
const noIndexFile = (filePath) => !/index/.test(filePath);
const routePaths = fileList
    .filter(filterTypes)
    .filter(noIndexFile);
const initRoutes = async (app) => {
    routePaths.forEach((routePath) => {
        let route = require(routePath);
        // check if a route exports multiple things, and
        // not a single route function it will export an object
        if (typeof route !== 'function' && route.router) {
            route = route.router;
        }
        app.use('/', route);
    });
};
exports.initRoutes = initRoutes;
//# sourceMappingURL=index.js.map