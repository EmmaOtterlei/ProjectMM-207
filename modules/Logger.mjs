import Chalk from "chalk";
import { HTTPMethods } from "./httpErrorCodes.mjs";
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
    // Check if a color is defined for the method, otherwise use the default color
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
        // Ensure there is only one instance of SuperLogger
        if (SuperLogger.instance == null) {
            SuperLogger.instance = this;
            // Initialize loggers array and global logging threshold
            this.#loggers = [];
            this.#globalThreshold = SuperLogger.LOGGING_LEVELS.NORMAL;
        }
        // Return the instance to enforce the singleton pattern
        return SuperLogger.instance;
    }

    // Log messages with a specified logging level
    static log(msg, logLevel = SuperLogger.LOGGING_LEVELS.NORMAL) {
        // Get the instance of SuperLogger
        let logger = SuperLogger.instance;
        // Check if the global threshold is higher than the specified log level
        if (logger.#globalThreshold > logLevel) {
            // Do not log if the threshold is higher
            return;
        }
        // Log the message
        logger.#writeToLog(msg);
    }

    // Create an automatic logger with a default threshold
    createAutoHTTPRequestLogger() {
        return this.createLimitedHTTPRequestLogger({ threshold: SuperLogger.LOGGING_LEVELS.NORMAL });
    }

    // Create a limited logger with a specified threshold
    createLimitedHTTPRequestLogger(options) {
        // Use the specified threshold or default to NORMAL
        const threshold = options.threshold || SuperLogger.LOGGING_LEVELS.NORMAL;
        // Return a middleware function for handling HTTP requests
        return (req, res, next) => {
            // Check if the global threshold is higher than the specified threshold
            if (this.#globalThreshold > threshold) {
                // Do not log if the threshold is higher
                return;
            }
            // Log the HTTP request details
            this.#LogHTTPRequest(req, res, next);
        };
    }

    // Log HTTP request details
    #LogHTTPRequest(req, res, next) {
        // Extract relevant details from the request
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

    // Write messages to the console and append them to a log file
    #writeToLog(msg) {
        // Add a newline character to the message
        msg += "\n";
        // Log the message to the console
        console.log(msg);

        // Append log messages to a log file
        fs.appendFile("./log.txt", msg, { encoding: "utf8" }, (err) => {
            // Log an error message if there's an issue writing to the log file
            if (err) {
                console.error('Error writing to log file:', err);
            }
        });
    }

    // Log performance metrics (for demonstration purposes)
    #logPerformanceMetrics(req) {
        // Check if the request object has a performance property
        const startTimestamp = req.performance && req.performance.now();
        // Perform some processing or simulate delay
        const endTimestamp = req.performance && req.performance.now();
        // Check if both start and end timestamps are available
        if (startTimestamp && endTimestamp) {
            // Calculate the duration of the simulated request processing time
            const duration = endTimestamp - startTimestamp;
            // Log the performance metric with a verbose logging level
            SuperLogger.log(`Performance: Request took ${duration} milliseconds`, SuperLogger.LOGGING_LEVELS.VERBOSE);
        }
    }
}

export default SuperLogger;
