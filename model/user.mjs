import DBManager from '../modules/storageManager.mjs';

class User {
    constructor(userName = "", email = "", pwsHash = "") {
        this.id = null;
        this.userName = userName;
        this.email = email;
        this.pwsHash = pwsHash;
    }

    async save() {
        try {
            if (!this.id) {
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

    static async getUserByEmail(email) {
        try {
            return await DBManager.getUserByEmail(email);
        } catch (error) {
            console.error("Error fetching user by email:", error);
            throw new Error("Failed to fetch user by email. " + error.message);
        }
    }

    static async getUserById(id) {
        try {
            return await DBManager.getUserById(id);
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw new Error("Failed to fetch user by ID. " + error.message);
        }
    }
}

export default User;