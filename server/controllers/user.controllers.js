import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).populate("posts");

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        res.status(200).json(user);
    }
    catch (error) {
        console.log("Error in getCurrentUser:", error);
        res.status(500).json({ message: `Get current user error: ${error.message}` });
    }
}

export const suggestedUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } })
            .select("-password")
            .limit(5);

        res.status(200).json(users);
    }
    catch (error) {
        console.log("Error occur in suggested users controller:", error);
        res.status(500).json({ message: `Get suggested users error: ${error.message}` });
    }
}

export const editProfile = async (req, res) => {
    try {
        const { name, userName, bio, profession, gender } = req.body;

        // console.log(name, userName, bio, profession, gender);

        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        const sameUserWithUserName = await User.findOne({ userName }).select("-password");

        if (sameUserWithUserName && sameUserWithUserName._id != req.userId) {
            return res.status(400).json({ message: "Username already exist" });
        }

        let profileImage;

        if (req.file) {
            profileImage = await uploadOnCloudinary(req.file.path);
        }

        user.name = name;
        user.userName = userName;
        user.bio = bio;
        user.profession = profession;
        user.gender = gender;

        if (profileImage) {
            user.profileImage = profileImage;
        }

        await user.save();

        res.status(200).json(user);

    }
    catch (error) {
        console.log("Error occur in edit profile controller:", error.message);
        res.status(500).json({ message: `Edit profile error: ${error.message}` });
    }
};

export const getProfile = async (req, res) => {
    try {
        const { userName } = req.params;
        const user = await User.findOne({ userName }).select("-password");

        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        res.status(200).json(user);

    }
    catch (error) {
        console.log("User not found in getProfile controller :", error.message);
        res.status(500).json({ message: `get profile error : ${error.message}` });
    }
}