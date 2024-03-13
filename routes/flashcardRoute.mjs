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

export default FLASHCARD_API;
