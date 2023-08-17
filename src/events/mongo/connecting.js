const chalk = require("chalk");

module.exports = {
    name: "connecting",
    execute() {
        console.log(chalk.yellow("[Database Status]: Connecting..."));
    }
}