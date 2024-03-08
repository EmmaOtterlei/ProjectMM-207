// Import necessary modules or dependencies
import DBManager from './storageManager.mjs'; // Adjust the path based on your project structure

// Define the User class
class User {
    // Constructor initializes user properties with default values
    constructor(email = "", pwsHash = "", userName = "") {
        this.email = email;
        this.pwsHash = pwsHash;
        this.userName = userName;
        this.id = null; // Adding an id property to represent the user's identifier in the database
    }

    // Async method to save or update the user in the database
    async save() {
        try {
            // If the user doesn't have an ID, create a new user
            if (!this.id) {
                const createdUser = await DBManager.createUser(this);
                this.id = createdUser.id; // Assuming DBManager.createUser returns the user with an ID
            } else {
                // If the user has an ID, update the existing user
                await DBManager.updateUser(this);
            }
        } catch (error) {
            // Handle errors that may occur during the database operations
            console.error("Error saving/updating user:", error);
            // You might want to add more sophisticated error handling here, depending on your application's requirements
        }
    }

    // Method to delete the user from the database
    delete() {
        // Delete the user using the DBManager
        DBManager.deleteUser(this);
    }
}

// Export the User class for use in other modules
export default User;
