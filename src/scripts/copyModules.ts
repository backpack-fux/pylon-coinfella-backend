import * as shell from "shelljs";

// Copy all the view templates
shell.rm("-rf", "dist/node_modules");
shell.cp("-R", "node_modules", "dist/node_modules");
