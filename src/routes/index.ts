// Dependencies
import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';

const walkSync = (dir: string, filelistParam: string[] = []) => {
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

const filterTypes = (filePath: string) => {
  return filePath.endsWith('.ts') || filePath.endsWith('.js');
};

const noIndexFile = (filePath: string) => !/index/.test(filePath);

const routePaths = fileList
  .filter(filterTypes)
  .filter(noIndexFile);

export const initRoutes = async (app: express.Application) => {
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
