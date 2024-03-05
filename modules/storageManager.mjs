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
          const output = await client.query(query, params);
          return output.rows;
      } catch (error) {
          console.error("Error executing query:", error);
          throw new Error("Failed to execute database query.");
      } finally {
          client.end();
      }
  }

  async updateUser(user) {
    // Check if required properties are present
    if (!user.id || !user.name || !user.email || !user.pswHash) {
        throw new Error("Invalid user object for update operation.");
    }

    const query = 'UPDATE "public"."Users" SET "name" = $1, "email" = $2, "password" = $3 WHERE id = $4 RETURNING *;';
    const result = await this.executeQuery(query, [user.name, user.email, user.pswHash, user.id]);

    // Check if the update was successful
    if (result.length !== 1) {
        throw new Error("Failed to update user.");
    }

    return user;
}

    async deleteUser(user) {
        const query = 'DELETE FROM "public"."Users" WHERE id = $1;';
        await this.executeQuery(query, [user.id]);
        // TODO: Check if the user was deleted
        return user;
    }

    async createUser(user) {
        const query = 'INSERT INTO "public"."Users"("name", "email", "password") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;';
        const result = await this.executeQuery(query, [user.name, user.email, user.pswHash]);
        
        if (result.length === 1) {
            user.id = result[0].id;
        }

        return user;
    }

    // TODO: Add any additional methods or optimizations
}

// The following is an example of how to get the db connection string from the environment variables.
// Adjust this based on your specific requirements.
const connectionString = process.env.DB_CONNECTIONSTRING || process.env.DB_CONNECTIONSTRING_LOCAL;

if (!connectionString) {
    throw new Error("DB connection string not provided.");
}

export default new DBManager(connectionString);