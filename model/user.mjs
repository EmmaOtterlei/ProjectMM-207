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

    // In user.mjs, adjusting the update method
    async update(updatedUserData) {
    try {
        // Ensure updatedUserData is an object; otherwise, initialize it as one
        updatedUserData = updatedUserData || {};

        // If a new password is provided and not undefined, hash it before updating
        if (updatedUserData.newPassword !== undefined) {
            this.pwsHash = await hashPassword(updatedUserData.newPassword);
        }

        // Update other fields only if they are provided and not undefined
        if (updatedUserData.newEmail !== undefined) this.email = updatedUserData.newEmail;
        if (updatedUserData.newUsername !== undefined) this.userName = updatedUserData.newUsername;

        // Assuming DBManager.updateUser handles updates correctly as shown
        await DBManager.updateUser({
            id: this.id,
            email: this.email,
            pwsHash: this.pwsHash,
            userName: this.userName,
        });
    } catch (error) {
        console.error("Error updating User:", error);
        throw new Error("Failed to update user. " + error.message);
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