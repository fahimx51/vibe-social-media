import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import loopRouter from './routes/loop.routes.js';
import storyRouter from './routes/story.routes.js';
import messageRouter from './routes/message.routes.js';
import { app, server } from './socket.js';
import notificationRouter from './routes/notification.routes.js';

dotenv.config();

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
app.use("/api/posts", postRouter);
app.use("/api/loops", loopRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);
app.use("/api/notification", notificationRouter);

server.listen(port, async () => {
    await connectDB();
    console.log(`Server is running on http://localhost:${port}`);
});

