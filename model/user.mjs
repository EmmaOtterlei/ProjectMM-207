import DBManager from '../modules/storageManager.mjs';
import { hashPassword } from '../modules/pwsHash.mjs';

class User {
    constructor( email = "", pwsHash = "", userName = "") {
        this.id = null;
        this.email = email;
        this.pwsHash = pwsHash;
        this.userName = userName;
    }

    async save() {
        try {
            if (!this.id) {
                this.pwsHash = hashPassword(this.pwsHash);
                const existingUser = await User.findUserByEmail(this.email);
                if (existingUser) {
                    throw new Error("User with this email already exists.");
                }
                const createdUser = await DBManager.createUser(this);
                if (!createdUser || !createdUser.id) {
                    throw new Error("Failed to create user.");
                }
                this.id = createdUser.id; 
            } else {
                await DBManager.updateUser(this);
            }
        } catch (error) {
            console.error("Error saving/updating User:", error);
            throw new Error("Failed to save/update user. " + error.message);
        }
    }

    async delete() {
        try {
            if (!this.id) {
                throw new Error("Cannot delete a user without an ID.");
            }
            await DBManager.deleteUser(this.id);
        } catch (error) {
            console.error("Error deleting User:", error);
            throw new Error("Failed to delete user. " + error.message);
        }
    }

    static async findUserByEmail(email) {
        try {
            return await DBManager.getUserByEmail(email);
        } catch (error) {
            console.error("Error fetching user by email:", error);
            throw new Error("Failed to fetch user by email. " + error.message);
        }
    }

    static async findUserById(id) {
        try {
            return await DBManager.getUserById(id);
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw new Error("Failed to fetch user by ID. " + error.message);
        }
    }
}

export { User };