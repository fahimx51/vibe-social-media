import express from 'express'
import dotenv from 'dotenv'
import http from 'http'
import { Server } from 'socket.io';


dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST']
    }
});

const userSocketMap = {}



export { app, io, server }