import Chalk from "chalk";
import { HTTPMethods } from "./httpErrorCodes.mjs";
import fs from "fs/promises";

const COLORS = {
    [HTTPMethods.POST]: Chalk.yellow,
    [HTTPMethods.GET]: Chalk.green,
    [HTTPMethods.PUT]: Chalk.yellow,
    [HTTPMethods.PATCH]: Chalk.yellow,
    [HTTPMethods.DELETE]: Chalk.red,
    Default: Chalk.gray,
};

const colorizeMethod = (method) => COLORS[method] || COLORS.Default;

class SuperLogger {
    static LOGGING_LEVELS = {
        ALL: 0,
        VERBOSE: 5,
        NORMAL: 10,
        IMPORTANT: 100,
        CRITICAL: 999,
    };

    static instance = new SuperLogger();

    constructor() {
        this.globalThreshold = SuperLogger.LOGGING_LEVELS.NORMAL;
    }

    static log(message, level = SuperLogger.LOGGING_LEVELS.NORMAL) {
        if (SuperLogger.instance.globalThreshold <= level) {
            SuperLogger.instance.writeToLog(message);
        }
    }

    async writeToLog(message) {
        const formattedMessage = `${new Date().toLocaleTimeString()} - ${message}\n`;
        console.log(formattedMessage);

        try {
            await fs.appendFile("./log.txt", formattedMessage);
        } catch (error) {
            console.error("Error writing to log file:", error);
        }
    }
}

export default SuperLogger;
