import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
  // Create connection without database selected
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '3306'),
    ssl: {
      minVersion: 'TLSv1.2',
      ca: fs.readFileSync(path.resolve(__dirname, 'isrgrootx1.pem'))
    },
  });

  try {
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    
    // Switch to the created database
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split and execute each SQL statement
    const statements = schema
      .split(';')
      .filter(statement => statement.trim())
      .map(statement => statement.trim() + ';');

    for (const statement of statements) {
      await connection.query(statement);
    }

    // Example modification if needed
    await connection.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        meta_title VARCHAR(255),
        meta_description TEXT,
        tags VARCHAR(255),
        status ENUM('draft', 'published') DEFAULT 'draft',
        image_url VARCHAR(255),
        video_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

export default initializeDatabase;
