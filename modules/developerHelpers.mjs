import SuperLogger from "./Logger.mjs";
import chalk from "chalk";

// Utility function to log a separator line
function logSeparatorLine(symbol = "#", length = 20) {
    const line = symbol.repeat(length);
    SuperLogger.log(line, SuperLogger.LOGGING_LEVELS.CRITICAL);
}

// Main function to print startup information
export default function printDeveloperStartupImportantInformation() {
    logSeparatorLine();

    const environment = process.env.ENVIRONMENT;
    const connectionString = environment === "local" ? process.env.DB_CONNECTIONSTRING_LOCAL : process.env.DB_CONNECTIONSTRING;

    SuperLogger.log(`Server environment: ${environment}`, SuperLogger.LOGGING_LEVELS.CRITICAL);
    SuperLogger.log(`Database connection: ${connectionString}`, SuperLogger.LOGGING_LEVELS.CRITICAL);

    if (process.argv.includes("--setup")) {
        SuperLogger.log(chalk.red("Running setup for database"), SuperLogger.LOGGING_LEVELS.CRITICAL);
        // TODO: Implement database setup logic
    }

    logSeparatorLine();
}
