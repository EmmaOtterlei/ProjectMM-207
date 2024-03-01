import pg from "pg";

class DBManager {
  #credentials = {};

  // Constructor to initialize database credentials
  constructor(connectionString) {
    this.#credentials = {
      connectionString,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    };
  }

  // Method to get a new client instance and connect to the database
  async getClient() {
    const client = new pg.Client(this.#credentials);
    await client.connect();
    return client;
  }

  // Method to update a user in the database
  async updateUser(user) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();

      const output = await client.query(
        'UPDATE "public"."Users" SET "name" = $1, "email" = $2, "password" = $3 WHERE id = $4;',
        [user.name, user.email, user.pswHash, user.id]
      );

      // TODO: Check if the user was updated

    } catch (error) {
      // TODO: Handle errors

    } finally {
      client.end(); // Disconnect from the database.
    }

    return user;
  }

  // Method to delete a user from the database
  async deleteUser(user) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();

      const output = await client.query(
        'DELETE FROM "public"."Users" WHERE id = $1;',
        [user.id]
      );

      // TODO: Check if the user was deleted

    } catch (error) {
      // TODO: Handle errors

    } finally {
      client.end(); // Disconnect from the database.
    }

    return user;
  }

  // Method to create a new user in the database
  async createUser(user) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();

      const output = await client.query(
        'INSERT INTO "public"."Users"("name", "email", "password") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;',
        [user.name, user.email, user.pswHash]
      );

      if (output.rows.length === 1) {
        user.id = output.rows[0].id;
      }

    } catch (error) {
      console.error(error);
      // TODO: Handle errors

    } finally {
      client.end(); // Disconnect from the database.
    }

    return user;
  }

  // TODO: Add any additional methods or optimizations

}

export default new DBManager(process.env.DB_CONNECTIONSTRING);
