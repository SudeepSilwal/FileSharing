import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnection from './db/db.js';
import router from './routes/routes.js';

dotenv.config(); // Place dotenv config at the top

const app = express();
app.use(cors());

app.use('/', router);

const PORT = process.env.PORT || 8000;

// Connect to the database
dbConnection();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
