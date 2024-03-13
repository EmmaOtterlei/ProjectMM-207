import DBManager from './DBManager.mjs';

class Deck {
    constructor(userId = "", name = "", topic = "", isPublic = false) {
        this.id = null;
        this.userId = userId;
        this.name = name;
        this.topic = topic;
        this.isPublic = isPublic;
    } 

    async save() {
        try {
            if (!this.id) {
                const createdDeck = await DBManager.createDeck(this);
                if (!createdDeck || !createdDeck.id) {
                    throw new Error("Failed to create deck.");
                }
                this.id = createdDeck.id; 
            } else {
                await DBManager.updateDeck(this);
            }
        } catch (error) {
            console.error("Error saving/updating Deck:", error);
            throw new Error("Failed to save/update deck. " + error.message);
        }
    }

    async delete() {
        try {
            if (!this.id) {
                throw new Error("Cannot delete a deck without an ID.");
            }
            await DBManager.deleteDeck(this.id);
        } catch (error) {
            console.error("Error deleting Deck:", error);
            throw new Error("Failed to delete deck. " + error.message);
        }
    }

    static async getAllDecks() {
        try {
            return await DBManager.getAllDecks();
        } catch (error) {
            console.error("Error fetching all decks:", error);
            throw new Error("Failed to fetch all decks. " + error.message);
        }
    }

    static async getDeckById(id) {
        try {
            return await DBManager.getDeckById(id);
        } catch (error) {
            console.error("Error fetching deck by ID:", error);
            throw new Error("Failed to fetch deck by ID. " + error.message);
        }
    }

    static async getDecksByUserId(userId) {
        try {
            return await DBManager.getDecksByUserId(userId);
        } catch (error) {
            console.error("Error fetching decks by user ID:", error);
            throw new Error("Failed to fetch decks by user ID. " + error.message);
        }
    }

    static async getPublicDecks() {
        try {
            return await DBManager.getPublicDecks();
        } catch (error) {
            console.error("Error fetching public decks:", error);
            throw new Error("Failed to fetch public decks. " + error.message);
        }
    }

    static async toggleDeckPrivacy(deckId) {
        try {
            return await DBManager.toggleDeckPrivacy(deckId);
        } catch (error) {
            console.error("Error toggling deck privacy:", error);
            throw new Error("Failed to toggle deck privacy. " + error.message);
        }
    }

    static async searchDecksByTopic(topic) {
        try {
            return await DBManager.searchDecksByTopic(topic);
        } catch (error) {
            console.error("Error searching decks by topic:", error);
            throw new Error("Failed to search decks by topic. " + error.message);
        }
    }

    static async countDecks() {
        try {
            return await DBManager.countDecks();
        } catch (error) {
            console.error("Error counting decks:", error);
            throw new Error("Failed to count decks. " + error.message);
        }
    }
}

export default Deck;
