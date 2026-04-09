import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('<h1>Server is Live!</h1>');
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, async () => {
    await connectDB();
    console.log(`Server is running on http://localhost:${port}`);
});

