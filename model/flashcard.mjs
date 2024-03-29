import DBManager from '../modules/storageManager.mjs';

class Flashcard {
    constructor(deckId = "", question = "", answer = "") {
        this.id = null;
        this.deckId = deckId;
        this.question = question;
        this.answer = answer;
    }

    async save() {
        if (!this.id) {
            const result = await DBManager.createFlashcard(this).catch(e => {
                console.error("Error saving Flashcard:", e);
                throw new Error("Failed to save flashcard.");
            });
            this.id = result.id;
        } else {
            await DBManager.updateFlashcard(this).catch(e => {
                console.error("Error updating Flashcard:", e);
                throw new Error("Failed to update flashcard.");
            });
        }
    }

    async delete() {
        try {
            if (!this.id) {
                throw new Error("Cannot delete a flashcard without an ID.");
            }
            await DBManager.deleteFlashcard(this.id);
        } catch (error) {
            console.error("Error deleting Flashcard:", error);
            throw new Error("Failed to delete flashcard. " + error.message);
        }
    }

    static async getFlashcardsByDeckId(deckId) {
        try {
            return await DBManager.getFlashcardsByDeckId(deckId);
        } catch (error) {
            console.error("Error fetching flashcards by deck ID:", error);
            throw new Error("Failed to fetch flashcards by deck ID. " + error.message);
        }
    }

    static async countFlashcards() {
        try {
            return await DBManager.countFlashcards();
        } catch (error) {
            console.error("Error counting flashcards:", error);
            throw new Error("Failed to count flashcards. " + error.message);
        }
    }

    static async searchFlashcards(keyword) {
        try {
            return await DBManager.searchFlashcards(keyword);
        } catch (error) {
            console.error("Error searching flashcards by keyword:", error);
            throw new Error("Failed to search flashcards by keyword. " + error.message);
        }
    }

    static async getRandomFlashcard() {
        try {
            return await DBManager.getRandomFlashcard();
        } catch (error) {
            console.error("Error fetching random flashcard:", error);
            throw new Error("Failed to fetch random flashcard. " + error.message);
        }
    }
}

export default Flashcard;
