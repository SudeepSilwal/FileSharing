import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnection from './db/db.js';
import router from './routes/routes.js';

dotenv.config(); // Place dotenv config at the top

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-domain.vercel.app'], // Add your frontend origins here
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add allowed HTTP methods
  credentials: true, // If you need cookies or authorization headers
}));

app.use('/', router);

const PORT = process.env.PORT || 8000;

// Connect to the database
dbConnection();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
