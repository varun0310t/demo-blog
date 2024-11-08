import express from 'express';
import cors from 'cors';
import mysql, { RowDataPacket } from 'mysql2/promise';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import initializeDatabase from './initDb';
import fs from 'fs';
import path from 'path';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
console.log('DB_HOST:', path.resolve(__dirname, 'isrgrootx1.pem'));
// Initialize database before starting the server
initializeDatabase()
  .then(() => {
    // Create a MySQL connection pool
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        minVersion: 'TLSv1.2',
        ca: fs.readFileSync(path.resolve(__dirname, 'isrgrootx1.pem'))
      },
    });

    // Helper function to build SQL query dynamically
    const buildInsertQuery = (body: any) => {
      const fields = ['title', 'content', 'meta_title', 'meta_description', 'tags', 'status'];
      const values = [body.title, body.content, body.meta_title, body.meta_description, body.tags, body.status];
      
      if (body.image_url?.trim()) {
        fields.push('image_url');
        values.push(body.image_url);
      }
      if (body.video_url?.trim()) {
        fields.push('video_url');
        values.push(body.video_url);
      }
      
      const placeholders = values.map(() => '?').join(', ');
      return {
        query: `INSERT INTO posts (${fields.join(', ')}) VALUES (${placeholders})`,
        values
      };
    };

    const buildUpdateQuery = (body: any, id: string) => {
      const fields = ['title', 'content', 'meta_title', 'meta_description', 'tags', 'status'];
      const values = [body.title, body.content, body.meta_title, body.meta_description, body.tags, body.status];
      
      if (body.image_url?.trim()) {
        fields.push('image_url');
        values.push(body.image_url);
      }
      if (body.video_url?.trim()) {
        fields.push('video_url');
        values.push(body.video_url);
      }
      
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      values.push(id); // Add id for WHERE clause
      
      return {
        query: `UPDATE posts SET ${setClause} WHERE id = ?`,
        values
      };
    };

    // API route to get all published blog posts
    app.get('/api/posts', async (req, res) => {
      try {
        const [rows] = await pool.query<RowDataPacket[]>(
          'SELECT id, title, content, meta_title, meta_description, tags, status, created_at, updated_at, ' +
          'NULLIF(image_url, "") as image_url, NULLIF(video_url, "") as video_url ' +
          'FROM posts WHERE status = "published"'
        );
        res.json(rows);
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
    });

    // API route to get all posts, including drafts
    app.get('/api/admin/posts', async (req, res) => {
      try {
        const [rows] = await pool.query<RowDataPacket[]>(
          'SELECT id, title, content, meta_title, meta_description, tags, status, created_at, updated_at, ' +
          'NULLIF(image_url, "") as image_url, NULLIF(video_url, "") as video_url FROM posts'
        );
        res.json(rows);
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
    });


    // API route to get a single post by id
    app.get('/api/posts/:id', async (req, res) => {
      try {
        const [rows] = await pool.query<RowDataPacket[]>(
          'SELECT id, title, content, meta_title, meta_description, tags, status, created_at, updated_at, ' +
          'NULLIF(image_url, "") as image_url, NULLIF(video_url, "") as video_url ' +
          'FROM posts WHERE id = ?', 
          [req.params.id]
        );
        if (rows.length === 0) {
          res.status(404).send('Post not found');
        } else {
          res.json(rows[0]);
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
    });

    // API route to create a new post
    app.post('/api/posts', async (req, res) => {
      try {
        const { query, values } = buildInsertQuery(req.body);
        await pool.query(query, values);
        res.status(201).send('Post created');
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
    });

    // API route to update a post
    app.put('/api/posts/:id', async (req, res) => {
      try {
        const { query, values } = buildUpdateQuery(req.body, req.params.id);
        await pool.query(query, values);
        res.send('Post updated');
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
    });

    // API route to delete a post
    app.delete('/api/posts/:id', async (req, res) => {
      try {
        await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
        res.send('Post deleted');
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

