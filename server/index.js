import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('<h1>Server is Live!</h1>');
});

app.listen(port, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${port}`);
});

