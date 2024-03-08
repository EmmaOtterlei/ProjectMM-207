import express from "express";
import { SessionManager, StateTracker, DataStorage } from "../modules/sessionMiddleware.mjs";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpErrorCodes.mjs";
import Logger from "../modules/Logger.mjs";
import DBManager from '../modules/storageManager.mjs'; // Adjust the path based on your project structure


const USER_API = express.Router();
USER_API.use(express.json());

const sessionManager = new SessionManager();
const stateTracker = new StateTracker();
const dataStorage = new DataStorage();

const users = [];

USER_API.get('/', (req, res, next) => {
    Logger.log("Demo of logging tool");
    Logger.log("An important message", Logger.LOGGING_LEVELS.CRITICAL);
});

USER_API.get('/email', (req, res, next) => {
    const user = DBManager.getUserFromEmail("test");
    console.log("user = ", user);
});


USER_API.post('/', async (req, res, next) => {
    try {
        const { email, pwsHash, userName } = req.body;
        console.log("Received request body:", req.body);

        // Input validation
        if (!email || !pwsHash || !userName) {
            console.error("Missing required fields in the request body");
            return res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).json({ error: "Missing required fields" });
        }

        // Check if a user with the same email already exists
        const existingUser = users.find(existingUser => existingUser.email === email);
        if (existingUser) {
            console.error("User with this email already exists");
            return res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).json({ error: "User with this email already exists" });
        }

        // Create a new user
        const user = new User(email, pwsHash, userName);

        try {
            // Create a new session for the user
            const session_id = await sessionManager.createSession(user.id);
            // Store user-specific data in the session
            await dataStorage.storeData(session_id, 'user', user);
        } catch (sessionError) {
            // Handle session-related errors
            console.error("Error creating session or storing data:", sessionError);
            return res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: "Internal Server Error" });
        }

        // Save the user to the database
        await user.save();

        // Add the user to the local array
        users.push(user);

        return res.status(HTTPCodes.SuccessfulResponse.Ok).end();
    } catch (error) {
        // Handle other errors
        console.error("Error creating user:", error);
        return res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: "Internal Server Error" });
    }
});

USER_API.put('/:id', (req, res) => {
    // Handle the PUT request for updating a user
    const userId = req.params.id;
    const updatedUserData = req.body;

    const index = users.findIndex(user => user.id === userId);

    if (index !== -1) {
        users[index] = { ...users[index], ...updatedUserData };

        // Get the session ID associated with the user
        const session_id = users[index].session_id;
        // Track user progress using the middleware
        stateTracker.trackProgress(session_id, { current_question: updatedUserData.current_question });

        res.status(HTTPCodes.SuccessfulResponse.NoContent).end();
    } else {
        return res.status(HTTPCodes.ClientSideErrorResponse.NotFound).json({ error: "User not found" });
    }
});

USER_API.delete('/:id', (req, res) => {
    // Handle the DELETE request for deleting a user
    const userId = req.params.id;

    const index = users.findIndex(user => user.id === userId);

    if (index !== -1) {
        users.splice(index, 1);
        res.status(HTTPCodes.SuccessfulResponse.NoContent).end();
    } else {
        res.status(HTTPCodes.ClientSideErrorResponse.NotFound).end();
    }
});

// Add other routes as needed

export default USER_API;