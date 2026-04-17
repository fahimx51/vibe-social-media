import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId)
            .select("-password")
            .populate("followers following loops")
            // 1. Populate your own posts with their comments
            .populate({
                path: "posts",
                populate: {
                    path: "comments.author",
                    select: "userName profileImage"
                }
            })
            // 2. Populate savedPosts WITH comments and authors
            .populate({
                path: "savedPosts",
                populate: [
                    {
                        path: "author",
                        select: "userName profileImage"
                    },
                    {
                        path: "comments.author", // This adds comments to saved posts
                        select: "userName profileImage"
                    }
                ]
            })
            .populate("story")

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    }
    catch (error) {
        console.log("Error in getCurrentUser:", error.message);
        res.status(500).json({ message: `Get current user error: ${error.message}` });
    }
}

export const suggestedUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } })
            .select("-password")
            .limit(5)
            .sort({ createdAt: -1 });

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
        const user = await User.findOne({ userName }).select("-password")
            .populate("followers following posts loops")

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

export const follow = async (req, res) => {
    try {
        const currUserId = req.userId;
        const targetUserId = req.params.targetUserId;

        if (!targetUserId) {
            return res.status(400).json({ message: "target user is missing" });
        }

        if (currUserId == targetUserId) {
            return res.status(400).json({ message: "You can't follow yourself" });
        }

        const currUser = await User.findById(currUserId);
        const targetUser = await User.findById(targetUserId);

        const isFollowing = currUser.following.includes(targetUserId);

        if (isFollowing) {
            currUser.following = currUser.following.filter(id => id.toString() != targetUserId);
            targetUser.followers = targetUser.followers.filter(id => id.toString() != currUserId);

            await currUser.populate("followers following posts loops")
            await targetUser.populate("followers following posts loops")

            await currUser.populate("savedPosts.author", "name userName profileImage");
            await targetUser.populate("savedPosts.author", "name userName profileImage");

            await currUser.save();
            await targetUser.save();

            res.status(200).json({ user: currUser, target: targetUser });
        }
        else {
            currUser.following.push(targetUserId);
            targetUser.followers.push(currUserId);

            await currUser.populate("followers following posts loops savedPosts")
            await targetUser.populate("followers following posts loops savedPosts")

            await currUser.populate("savedPosts.author", "name userName profileImage");
            await targetUser.populate("savedPosts.author", "name userName profileImage");

            await currUser.save();
            await targetUser.save();


            res.status(200).json({ user: currUser, target: targetUser });
        }
    }
    catch (error) {
        console.log("follow controller error :", error.message);
        res.status(500).json({ message: `error in follow controller : ${error.message}` });
    }
}