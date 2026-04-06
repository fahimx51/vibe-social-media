import express from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.post("/signUp", signUp);
authRouter.post("/signIn", signIn);
authRouter.get("/signOut", signOut);

export default authRouter;