import express from 'express';
import 'dotenv/config';
import SuperLogger from './modules/Logger.mjs';
import printDeveloperStartupInportantInformationMSG from "./modules/developerHelpers.mjs";
import USER_API from './routes/usersRoute.mjs';
import FLASHCARD_API from './routes/flashcardRoute.mjs';

// Import session middleware classes
import { SessionManager, StateTracker, DataStorage } from './modules/sessionMiddleware.mjs';

// Print developer startup information
printDeveloperStartupInportantInformationMSG();

// Create an instance of the server
const server = express();

// Select a port for the server to use
const port = process.env.PORT || 8080;
server.set('port', port);

// Enable logging for server using SuperLogger
const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger());

// Define a folder that will contain static files
server.use(express.static('public'));

// Tell the server to use the USER_API (all URLs using this code will have to have /user after the base address)
server.use("/user", USER_API);

server.use("/flashcard", FLASHCARD_API);

// Create instances of the session management classes
const sessionManager = new SessionManager();
const stateTracker = new StateTracker();
const dataStorage = new DataStorage();


// Global error handler
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});