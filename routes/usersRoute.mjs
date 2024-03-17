import express from "express";
import { HTTPCodes } from "../modules/httpErrorCodes.mjs";
//import Logger from "../modules/Logger.mjs";
import { User } from "../model/user.mjs";
import { hashPassword } from "../modules/pwsHash.mjs";
import DBManager from "../modules/storageManager.mjs"

const USER_API = express.Router();
USER_API.use(express.json());

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
            return res.status(HTTPCodes.ClientSideErrorResponse.Unauthorized).json({ error: "Invalid credentials" });
        }

        console.log(`User object:`, user);
        const hashedInputPassword = hashPassword(password);
        console.log(`Input hash: ${hashedInputPassword}`);
        console.log(`Stored hash: ${user.pwshash}`); // Ensuring this matches the property name exactly as in your user object

        if (user.pwshash !== hashedInputPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Explicitly setting the response status to 200 OK for successful login
        res.status(HTTPCodes.SuccessfulResponse.Ok).json({ message: "Login successful", userId: user.id });
    } catch (error) {
        console.error("Error during login process:", error);
        res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: "Internal server error" });
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
        res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: "Error hashing password" });
    }
});


// PUT (update) a user
// In usersRoute.mjs, ensure you're correctly handling the request body
USER_API.put('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { email, pwsHash, userName } = req.body;

        // Fetch existing user data
        let existingUser = await User.findUserById(userId);
        if (!existingUser) {
            return res.status(HTTPCodes.ClientSideErrorResponse.NotFound).json({ error: "User not found" });
        }

        // Prepare the update payload, merging provided values with existing ones
        let userToUpdate = {
            id: userId,
            email: email || existingUser.email,
            userName: userName || existingUser.userName,
            pwsHash: existingUser.pwsHash // Initially set to current hash
        };

        // If a new password is provided, hash it
        if (pwsHash) {
            userToUpdate.pwsHash = await hashPassword(pwsHash);
        }

        // Perform the update operation
        await DBManager.updateUser(userToUpdate);

        res.status(HTTPCodes.SuccessfulResponse.Ok).json({ message: "User updated successfully", user: userToUpdate });
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
        const deleteUser = new User(userId);
        await deleteUser.delete();


        res.status(HTTPCodes.SuccessfulResponse.NoContent).end();
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: "Internal Server Error" });
    }
});

// Add other routes as needed

export default USER_API;
