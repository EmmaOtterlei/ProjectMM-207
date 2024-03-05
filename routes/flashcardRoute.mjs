// routes/otherRoute.mjs

import express from 'express';
import User from "../modules/user.mjs";

const router = express.Router();

// In-memory storage for flashcards (replace this with a database in a real app)
let flashcards = [];

// GET all flashcards
router.get('/', (req, res) => {
    res.status(200).json(flashcards);
});

// GET a specific flashcard by ID
router.get('/:id', (req, res) => {
    const cardId = req.params.id;
    const card = flashcards.find(card => card.id === cardId);

    if (card) {
        res.status(200).json(card);
    } else {
        res.status(404).json({ error: 'Flashcard not found' });
    }
});

// POST a new flashcard
router.post('/', (req, res) => {
    const newCard = req.body; // Assuming the request body contains the flashcard data
    newCard.id = generateUniqueId(); // Generate a unique ID for the flashcard

    flashcards.push(newCard);
    res.status(201).json(newCard);
});

// PUT (update) a flashcard by ID
router.put('/:id', (req, res) => {
    const cardId = req.params.id;
    const updatedCardData = req.body; // Assuming the request body contains the updated flashcard data

    const index = flashcards.findIndex(card => card.id === cardId);

    if (index !== -1) {
        flashcards[index] = { ...flashcards[index], ...updatedCardData };
        res.status(200).json(flashcards[index]);
    } else {
        res.status(404).json({ error: 'Flashcard not found' });
    }
});

// DELETE a flashcard by ID
router.delete('/:id', (req, res) => {
    const cardId = req.params.id;

    flashcards = flashcards.filter(card => card.id !== cardId);

    res.status(204).end(); // No content for successful deletion
});

// Helper function to generate a unique ID
function generateUniqueId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export default router;