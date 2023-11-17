import * as shell from "shelljs";

// Copy all the view templates
shell.rm('-rf', 'dist/email/templates');
shell.cp("-R", "src/email/templates", "dist/email/templates");