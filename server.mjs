import 'dotenv/config';
import express from 'express';
import SuperLogger from './modules/Logger.mjs';


// Import routes
import USER_API from './routes/usersRoute.mjs';
import FLASHCARD_API from './routes/flashcardRoute.mjs';


const server = express();
// Create an instance of the server
server.use(express.json());

// Select a port for the server to use
const port = process.env.PORT || 8080;
server.set('port', port);

// Enable logging for server using SuperLogger
const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger());

// Define a folder that will contain static files
server.use(express.static('public'));

// Tell the server to use the USER_API and FLASHCARD_API
server.use("/user", USER_API);

server.use("/flashcard", FLASHCARD_API);

// Load templates for specific routes
async function loadTemplate(templatePath, res) {
    try {
        await insertTemplatesFrom(templatePath, res);
    } catch (error) {
        console.error(`Error loading ${templatePath}:`, error);
        res.status(500).send('Internal Server Error');
    }
}

// Routes for loading templates
server.get('/login', (req, res) => loadTemplate('./view/loginTemplate.html', res));
server.get('/createUser', (req, res) => loadTemplate('./view/createUserTemplate.html', res));
server.get('/decks', (req, res) => loadTemplate('./view/decksTemplate.html', res));
server.get('/flashcardCreation', (req, res) => loadTemplate('./view/flashcardCreationTemplate.html', res));


// Global error handler
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
