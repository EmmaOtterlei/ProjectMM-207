import Chalk from "chalk";
import { HTTPMethods } from "./httpConstants.mjs";
import fs from "fs/promises";

// Define colors for different HTTP methods
let COLORS = {};
COLORS[HTTPMethods.POST] = Chalk.yellow;
COLORS[HTTPMethods.PATCH] = Chalk.yellow;
COLORS[HTTPMethods.PUT] = Chalk.yellow;
COLORS[HTTPMethods.GET] = Chalk.green;
COLORS[HTTPMethods.DELETE] = Chalk.red;
COLORS.Default = Chalk.gray;

// Convenience function for colorizing HTTP methods
const colorize = (method) => {
    if (method in COLORS) {
        return COLORS[method](method);
    }
    return COLORS.Default(method);
};

class SuperLogger {
    // Logging levels for controlling the verbosity of logs
    static LOGGING_LEVELS = {
        ALL: 0,
        VERBOSE: 5,
        NORMAL: 10,
        IMPORTANT: 100,
        CRITICAL: 999,
    };

    // Global logging threshold level
    #globalThreshold = SuperLogger.LOGGING_LEVELS.NORMAL;
    // Array to store different loggers
    #loggers;

    // Singleton pattern to ensure a single instance
    static instance = null;

    constructor() {
        if (SuperLogger.instance == null) {
            SuperLogger.instance = this;
            this.#loggers = [];
            this.#globalThreshold = SuperLogger.LOGGING_LEVELS.NORMAL;
        }
        return SuperLogger.instance;
    }

    // Log messages with a specified logging level
    static log(msg, logLevl = SuperLogger.LOGGING_LEVELS.NORMAL) {
        let logger = SuperLogger.instance;
        if (logger.#globalThreshold > logLevl) {
            return;
        }
        logger.#writeToLog(msg);
    }

    // Create an automatic logger with a default threshold
    createAutoHTTPRequestLogger() {
        return this.createLimitedHTTPRequestLogger({ threshold: SuperLogger.LOGGING_LEVELS.NORMAL });
    }

    // Create a limited logger with a specified threshold
    createLimitedHTTPRequestLogger(options) {
        const threshold = options.threshold || SuperLogger.LOGGING_LEVELS.NORMAL;
        return (req, res, next) => {
            if (this.#globalThreshold > threshold) {
                return;
            }
            this.#LogHTTPRequest(req, res, next);
        };
    }

    #LogHTTPRequest(req, res, next) {
        const type = req.method;
        const path = req.originalUrl;
        const when = new Date().toLocaleTimeString();

        // Colorize and format log entry
        const coloredType = colorize(type);
        const logEntry = [when, coloredType, path].join(" ");

        // Log the entry
        this.#writeToLog(logEntry);

        // Log performance metrics (for demonstration purposes)
        this.#logPerformanceMetrics(req);

        // Proceed to the next handler function
        next();
    }

    #writeToLog(msg) {
        msg += "\n";
        console.log(msg);
        // Append log messages to a log file
        fs.appendFile("./log.txt", msg, { encoding: "utf8" }, (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
            }
        });
    }

    // Log performance metrics (for demonstration purposes)
    #logPerformanceMetrics(req) {
        const startTimestamp = req.performance && req.performance.now();
        // Perform some processing or simulate delay
        const endTimestamp = req.performance && req.performance.now();
        if (startTimestamp && endTimestamp) {
            const duration = endTimestamp - startTimestamp;
            SuperLogger.log(`Performance: Request took ${duration} milliseconds`, SuperLogger.LOGGING_LEVELS.VERBOSE);
        }
    }
}

export default SuperLogger;