import "dotenv/config";
import { pool } from "./index.js";

async function initDb() {
  const client = await pool.connect();
  try {
    console.log("Initializing database...");

    // DROP tables to force schema update
    // WARNING: This deletes all data. In production, we would migrate.
    await client.query(`DROP TABLE IF EXISTS project_outputs CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS projects CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS users CASCADE;`);

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        phone VARCHAR(50),
        dob DATE,
        oauth_provider VARCHAR(50),
        oauth_id VARCHAR(255),
        account_status VARCHAR(20) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(oauth_provider, oauth_id)
      );
    `);

    // Create projects table with user_id FK
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        project_description TEXT NOT NULL,
        team_size INTEGER,
        deadline VARCHAR(100),
        skill_level VARCHAR(50),
        constraints TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create project_outputs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_outputs (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        requirements JSONB,
        tech_stack JSONB,
        task_plan JSONB,
        risks JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    client.release();
    pool.end(); // Close pool after script finishes
  }
}

initDb();
