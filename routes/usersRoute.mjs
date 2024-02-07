import express, { response } from "express";
import { SessionManager, StateTracker, DataStorage } from "./sessionMiddleware.js";
import User from "../modules/user.mjs";
import HttpCodes from "../modules/httpErrorCodes.mjs";



const USER_API = express.Router();

// Create instances of the session management classes
const sessionManager = new SessionManager();
const stateTracker = new StateTracker();
const dataStorage = new DataStorage();

const users = [];

USER_API.get('/:id', (req, res) => {
    const userId = req.params.id;
    const user = users.find(user => user.id === userId);

    if (user) {
        res.status(HttpCodes.SuccessfulResponse.Ok).json(user);
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.NotFound).end();
})

USER_API.post('/', (req, res, next) => {

    // This is using javascript object destructuring.
    // Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
    // https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/
    const { email, pswHash, UserName } = req.body;

    if (email && pswHash && UserName) {
        const user = new User(email, pswHash, UserName);
        
        ///TODO: Does the user exist?
        const exists = users.some(existingUser => existingUser.email === email)

        if (!exists) {
            users.push(user);
            res.status(HttpCodes.SuccesfullRespons.Ok).end();
        } else {
            res.status(HttpCodes.ClientSideErrorRespons.BadRequest).end();
        }

    } else {
        res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }

});

USER_API.put('/:id', (req, res) => {
    /// TODO: Edit user
    const userId = req.params.id;
    const updatedUserData = req.body;

    const index = users.findIndex(user => user.id === userId);

    if (index !== -1) {
        users[index] = { ...users[index], ...updatedUserData };
        res.status(HttpCodes.SuccessfulResponse.NoContent).end();
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.NotFound).end();
    }

});

USER_API.delete('/:id', (req, res) => {
    /// TODO: Delete user.
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
