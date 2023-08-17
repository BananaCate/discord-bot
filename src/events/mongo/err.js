const chalk = require("chalk");

module.exports = {
    name: "err",
    execute(err) {
        console.log(chalk.red(`[Database Status]: errored\n${err}`));
    }
}