const chalk = require("chalk");

module.exports = {
    name: "disconnected",
    execute() {
        console.log(chalk.magenta("[Database Status]: Disconnected."));
    }
}