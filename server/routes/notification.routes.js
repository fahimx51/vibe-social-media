import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getAllNotification, markAsRead } from "../controllers/notification.controllers.js";

const notificationRouter = express.Router();

notificationRouter.get("/getAllNotifications", isAuth, getAllNotification);
notificationRouter.post("/markAsRead", isAuth, markAsRead);


export default notificationRouter;