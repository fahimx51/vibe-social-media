import express from "express";
import { editProfile, getCurrentUser, getProfile, suggestedUsers } from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/suggestedUsers", isAuth, suggestedUsers);
userRouter.get("/getProfile/:userName", isAuth, getProfile);
userRouter.post("/editProfile", isAuth, upload.single('profileImage'), editProfile);

export default userRouter;