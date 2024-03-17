import pg from "pg";

class DBManager {
  #credentials = {};

  constructor(connectionString) {
    this.#credentials = {
      connectionString,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    };
  }

  async executeQuery(query, params) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      console.log("Executing query:", query, "with params:", params);
      const output = await client.query(query, params);
      return output.rows;
    } catch (error) {
      console.error("Error executing query:", error);
      throw new Error("Failed to execute database query.");
    } finally {
      client.end();
    }
  }

  // User Operations

  async createUser(user) {
    const query = 'INSERT INTO users (email, pwsHash, userName) VALUES ($1, $2, $3) RETURNING id;';
    const result = await this.executeQuery(query, [ user.email, user.pwsHash, user.userName]);

    if (result && result.length === 1) {
      user.id = result[0].id;
    }

    return user;
  }

  async updateUser(user) {
    if (!user.id || !user.email || !user.pwsHash || !user.userName) {
      throw new Error("Invalid user object for update operation.");
    }

    const query = 'UPDATE users SET userName = $1, email = $2, pwsHash = $3 WHERE id = $4 RETURNING *;';
    const result = await this.executeQuery(query, [user.userName, user.email, user.pwsHash, user.id]);

    if (result.length !== 1) {
      throw new Error("Failed to update user.");
    }

    return user;
  }

  async deleteUser(user) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *;';
    const result = await this.executeQuery(query, [user.id]);
    
    // Confirm deletion
    if (result.length === 0) {
      throw new Error("Failed to delete user or user not found.");
    }

    return user.id;
  }

  async getUserById(user) {
    const query = 'SELECT * FROM users WHERE id = $1;';
    const result = await this.executeQuery(query, [user.id]);
    return result.length === 1 ? result[0] : null;
  }

  async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1;';
    try {
        const result = await this.executeQuery(query, [email]);
        return result.length === 1 ? result[0] : null;
    } catch (error) {
        console.error("Error executing query:", error);
        throw new Error("Failed to fetch user by email. " + error.message);
    }
}

  // Deck Operations

  async createDeck(deck) {
    const query = 'INSERT INTO flashcards_decks (USER_ID, NAME, TOPIC, PUBLIC) VALUES ($1, $2, $3, $4) RETURNING id;';
    const result = await this.executeQuery(query, [deck.userId, deck.name, deck.topic, deck.public]);

    if (result && result.length === 1) {
      deck.id = result[0].id;
    }

    return deck;
  }

  async updateDeck(deck) {
    if (!deck.id || !deck.userId || !deck.name || !deck.topic || deck.public === undefined) {
      throw new Error("Invalid deck object for update operation.");
    }

    const query = 'UPDATE flashcards_decks SET USER_ID = $1, NAME = $2, TOPIC = $3, PUBLIC = $4 WHERE id = $5 RETURNING *;';
    const result = await this.executeQuery(query, [deck.userId, deck.name, deck.topic, deck.public, deck.id]);

    if (result.length !== 1) {
      throw new Error("Failed to update deck.");
    }

    return deck;
  }

  async deleteDeck(deckId) {
    const query = 'DELETE FROM flashcards_decks WHERE id = $1 RETURNING *;';
    const result = await this.executeQuery(query, [deckId]);
    
    // Confirm deletion
    if (result.length === 0) {
      throw new Error("Failed to delete deck or deck not found.");
    }

    return deckId;
  }

  async getAllDecks() {
    const query = 'SELECT * FROM flashcards_decks;';
    return this.executeQuery(query, []);
  }

  async getDeckById(id) {
    const query = 'SELECT * FROM flashcards_decks WHERE id = $1;';
    const result = await this.executeQuery(query, [id]);
    return result.length === 1 ? result[0] : null;
  }

  async getDecksByUserId(userId) {
    const query = 'SELECT * FROM flashcards_decks WHERE user_id = $1;';
    return this.executeQuery(query, [userId]);
  }

  async getPublicDecks() {
    const query = 'SELECT * FROM flashcards_decks WHERE public = true;';
    return this.executeQuery(query, []);
  }

  async toggleDeckPrivacy(deckId) {
    const deck = await this.getDeckById(deckId);
    if (!deck) {
        throw new Error("Deck not found.");
    }

    const updatedPrivacy = !deck.public;
    const query = 'UPDATE flashcards_decks SET public = $1 WHERE id = $2 RETURNING *;';
    const result = await this.executeQuery(query, [updatedPrivacy, deckId]);

    if (result.length !== 1) {
        throw new Error("Failed to toggle deck privacy.");
    }

    return result[0];
  }

  async searchDecksByTopic(topic) {
    const query = 'SELECT * FROM flashcards_decks WHERE topic LIKE $1;';
    return this.executeQuery(query, [`%${topic}%`]);
  }

  async countDecks() {
    const query = 'SELECT COUNT(*) FROM flashcards_decks;';
    const result = await this.executeQuery(query, []);
    return result[0].count;
  }
}

const connectionString = process.env.DB_CONNECTIONSTRING || process.env.DB_CONNECTIONSTRING_LOCAL;

if (!connectionString) {
  throw new Error("DB connection string not provided.");
}

export default new DBManager(connectionString);

