import express from "express";
import { editProfile, follow, getCurrentUser, getProfile, search, suggestedUsers } from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/suggestedUsers", isAuth, suggestedUsers);
userRouter.get("/getProfile/:userName", isAuth, getProfile);
userRouter.get("/search", isAuth, search);
userRouter.post("/editProfile", isAuth, upload.single('profileImage'), editProfile);
userRouter.post("/follow/:targetUserId", isAuth, follow);

export default userRouter;