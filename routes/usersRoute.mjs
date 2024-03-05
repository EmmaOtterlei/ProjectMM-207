import express, { response } from "express";
import { SessionManager, StateTracker, DataStorage } from "..modules/sessionMiddleware.mjs";
import User from "../modules/user.mjs";
import HttpCodes from "../modules/httpErrorCodes.mjs";
import Logger from "../modules/Logger.mjs";


const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

// Create instances of the session management classes
const sessionManager = new SessionManager();
const stateTracker = new StateTracker();
const dataStorage = new DataStorage();

const users = [];

USER_API.get('/', (req, res, next) => {
    Logger.log("Demo of logging tool");
    Logger.log("A important msg", Logger.LOGGING_LEVELS.CRTICAL);
})

USER_API.get('/:id', (req, res) => {
    const userId = req.params.id;
    const user = users.find(user => user.id === userId);

    if (user) {
        res.status(HttpCodes.SuccessfulResponse.Ok).json(user);
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.NotFound).end();
    }
})


USER_API.post('/', (req, res, next) => {
    try {
        const { email, pswHash, UserName } = req.body;

        if (!email || !pswHash || !UserName) {
            return res.status(HttpCodes.ClientSideErrorRespons.BadRequest).json({ error: "Missing required fields" });
        }

        const exists = users.some(existingUser => existingUser.email === email);

        if (exists) {
            return res.status(HttpCodes.ClientSideErrorRespons.BadRequest).json({ error: "User with this email already exists" });
        }

        const user = new User(email, pswHash, UserName);

        // Create a new session for the user
        const session_id = sessionManager.createSession(user.id);
        // Store user-specific data in the session
        dataStorage.storeData(session_id, 'user', user);

        users.push(user);
        return res.status(HttpCodes.SuccesfullRespons.Ok).end();
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(HttpCodes.ServerSideErrorResponse.InternalServerError).json({ error: "Internal Server Error" });
    }
});

USER_API.put('/:id', (req, res) => {

    const userId = req.params.id;
    const updatedUserData = req.body;

    const index = users.findIndex(user => user.id === userId);

    if (index !== -1) {
        users[index] = { ...users[index], ...updatedUserData };
       
     // Get the session ID associated with the user
     const session_id = users[index].session_id;
     // Track user progress using the middleware
     stateTracker.trackProgress(session_id, { current_question: updatedUserData.current_question });
       
       
        res.status(HttpCodes.SuccessfulResponse.NoContent).end();
    } else {
        return res.status(HttpCodes.ClientSideErrorResponse.NotFound).json({ error: "User not found" });
    }

});

USER_API.delete('/:id', (req, res) => {

    const userId = req.params.id;

    const index = users.findIndex(user => user.id === userId);

    if (index !== -1) {
        users.splice(index, 1);
        res.status(HttpCodes.SuccessfulResponse.NoContent).end();
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.NotFound).end();
    }
});

export default USER_API
