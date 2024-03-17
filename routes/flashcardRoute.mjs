import express from 'express';
import Flashcard from "../model/flashcard.mjs";
import { HTTPCodes } from "../modules/httpErrorCodes.mjs"; // Import HTTP status codes module

const FLASHCARD_API = express.Router();
FLASHCARD_API.use(express.json());

// GET all flashcards
FLASHCARD_API.get('/', async (req, res) => {
    try {
        const flashcards = await Flashcard.getAll();
        res.status(HTTPCodes.SuccessfulResponse.Ok).json(flashcards); // Use HTTP status code from the imported module
    } catch (error) {
        console.error("Error fetching flashcards:", error);
        res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: 'Internal server error' }); // Use HTTP status code from the imported module
    }
});

// GET a specific flashcard by ID
FLASHCARD_API.get('/:id', async (req, res) => {
    const flashcardId = req.params.id;
    try {
        const flashcard = await Flashcard.getById(flashcardId);
        if (flashcard) {
            res.status(HTTPCodes.SuccessfulResponse.Ok).json(flashcard); // Use HTTP status code from the imported module
        } else {
            res.status(HTTPCodes.ClientSideErrorResponse.NotFound).json({ error: 'Flashcard not found' }); // Use HTTP status code from the imported module
        }
    } catch (error) {
        console.error("Error fetching flashcard:", error);
        res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: 'Internal server error' }); // Use HTTP status code from the imported module
    }
});

// POST a new flashcard
FLASHCARD_API.post('/', async (req, res) => {
    const { deckId, question, answer } = req.body;
    try {
        const newFlashcard = new Flashcard(deckId, question, answer);
        await newFlashcard.save();
        res.status(HTTPCodes.SuccessfulResponse.Created).json(newFlashcard); // Use HTTP status code from the imported module
    } catch (error) {
        console.error("Error creating flashcard:", error);
        res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: 'Internal server error' }); // Use HTTP status code from the imported module
    }
});

// PUT (update) a flashcard by ID
FLASHCARD_API.put('/:id', async (req, res) => {
    const flashcardId = req.params.id;
    const updatedData = req.body;
    try {
        const flashcard = await Flashcard.getById(flashcardId);
        if (!flashcard) {
            return res.status(HTTPCodes.ClientSideErrorResponse.NotFound).json({ error: 'Flashcard not found' }); // Use HTTP status code from the imported module
        }
        flashcard.update(updatedData);
        res.status(HTTPCodes.SuccessfulResponse.Ok).json(flashcard); // Use HTTP status code from the imported module
    } catch (error) {
        console.error("Error updating flashcard:", error);
        res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: 'Internal server error' }); // Use HTTP status code from the imported module
    }
});

// DELETE a flashcard by ID
FLASHCARD_API.delete('/:id', async (req, res) => {
    const flashcardId = req.params.id;
    try {
        const flashcard = await Flashcard.getById(flashcardId);
        if (!flashcard) {
            return res.status(HTTPCodes.ClientSideErrorResponse.NotFound).json({ error: 'Flashcard not found' }); // Use HTTP status code from the imported module
        }
        await flashcard.delete();
        res.status(HTTPCodes.SuccessfulResponse.NoContent).end(); // Use HTTP status code from the imported module
    } catch (error) {
        console.error("Error deleting flashcard:", error);
        res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: 'Internal server error' }); // Use HTTP status code from the imported module
    }
});

FLASHCARD_API.get('/quiz/:deckId', async (req, res) => {
    try {
        const deckId = req.params.deckId;
        // Implement logic to retrieve flashcards for the specified deckId
        // Present flashcards one by one to the user
        // Allow user to flip the card and submit their answer
        // Provide immediate feedback to the user
        // Keep track of user's performance (correct/incorrect answers)
    } catch (error) {
        console.error("Error in quiz mode:", error);
        res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: "Internal Server Error" });
    }
});

// Quiz Statistics
FLASHCARD_API.get('/quiz/:userId/statistics', async (req, res) => {
    try {
        const userId = req.params.userId;
        // Implement logic to retrieve quiz statistics for the specified userId
        // Calculate and present statistics such as number of quizzes taken, average score, etc.
    } catch (error) {
        console.error("Error fetching quiz statistics:", error);
        res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: "Internal Server Error" });
    }
});


FLASHCARD_API.put('/deck/:deckId/organize', async (req, res) => {
    try {
        const deckId = req.params.deckId;
        const { category } = req.body;
        // Implement logic to update the category of the specified deckId
    } catch (error) {
        console.error("Error organizing deck:", error);
        res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).json({ error: "Internal Server Error" });
    }
});

export default FLASHCARD_API;
