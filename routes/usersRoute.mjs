import express from "express";
import { HTTPCodes } from "../modules/httpErrorCodes.mjs";
//import Logger from "../modules/Logger.mjs";
import { User } from "../model/user.mjs";
import { hashPassword } from "../modules/pwsHash.mjs";

const USER_API = express.Router();
USER_API.use(express.json());

/*
// GET all users
USER_API.get('/', async (req, res) => {
    try {
        const allUsers = await User.getAllUsers();
        res.status(HTTPCodes.SuccessfulResponse.Ok).json(allUsers);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: "Internal Server Error" });
    }
}); */

// POST a new user
USER_API.post('/', async (req, res) => {
    try {
        const { email, pwsHash, userName } = req.body;

        // Input validation
        if (!email || !pwsHash || !userName) {
            console.error("Missing required fields in the request body");
            return res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).json({ error: "Missing required fields" });
        }

        // Check if a user with the same email already exists
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            console.error("User with this email already exists");
            return res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).json({ error: "User with this email already exists" });
        }

        // Create a new user instance
        const newUser = new User(email, pwsHash, userName);
        await newUser.save();

        res.status(HTTPCodes.SuccessfulResponse.Created).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: "Internal Server Error" });
    }
});

USER_API.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log(`User object:`, user);
        const hashedInputPassword = hashPassword(password);
        console.log(`Input hash: ${hashedInputPassword}`);
        // Correctly access the 'pwshash' property
        console.log(`Stored hash: ${user.pwshash}`); // Corrected to 'pwshash'

        if (user.pwshash !== hashedInputPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Proceed with login success logic here
        res.json({ message: "Login successful" });
    } catch (error) {
        console.error("Error during login process:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});






USER_API.post('/hashPassword', (req, res) => {
    const { password } = req.body;
    try {
        // Hash the password using your existing function
        const hashedPassword = hashPassword(password);

        // Send the hashed password back to the client
        res.json({ hashedPassword });
    } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ error: "Error hashing password" });
    }
});

// PUT (update) a user
USER_API.put('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUserData = req.body;

        // Update the user
        const user = await User.findUserById(userId);
        if (!user) {
            return res.status(HTTPCodes.ClientSideErrorResponse.NotFound).json({ error: "User not found" });
        }

        // Update user data
        Object.assign(user, updatedUserData);
        await user.save();

        res.status(HTTPCodes.SuccessfulResponse.NoContent).end();
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: "Internal Server Error" });
    }
});

// DELETE a user
USER_API.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Delete the user
        const user = await User.findUserById(userId);
        if (!user) {
            return res.status(HTTPCodes.ClientSideErrorResponse.NotFound).json({ error: "User not found" });
        }

        await user.delete();

        res.status(HTTPCodes.SuccessfulResponse.NoContent).end();
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: "Internal Server Error" });
    }
});

// Add other routes as needed

export default USER_API;
