import express from "express";
import { getCurrentUser, suggestedUsers } from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/suggestedUsers", isAuth, suggestedUsers);

export default userRouter;