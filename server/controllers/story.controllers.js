import uploadOnCloudinary from "../config/cloudinary.js";
import Story from "../models/story.model.js";
import User from "../models/user.model.js";

export const uploadStory = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (user.story) {
            await Story.findByIdAndDelete(user.story);
            user.story = null;
        }

        const { mediaType } = req.body;

        let media;
        if (req.file) {
            media = await uploadOnCloudinary(req.file.path);
        }
        else {
            res.status(400).json({ message: "Media is required" });
        }

        const story = await Story.create({
            author: req.userId, mediaType, media
        });

        user.story = story._id;

        await user.save();

        const populatedStory = await Story.findById(story._id).populate("author", "name userName profileImage").populate("viewers", "name userName profileImage");

        res.status(200).json(populatedStory);
    }
    catch (error) {
        console.log("Error in upload story controller : ", error.message);
        res.status(500).json({ message: error.message });
    }
};
export const viewStory = async (req, res) => {
    try {
        const storyId = req.params.storyId;
        
        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(400).json({ message: "Story not found" });
        }

        const viewersId = story.viewers.map(id => id.toString());

        if (!viewersId.includes(req.userId.toString())) {
            story.viewers.push(req.userId);
        }

        await story.save();

        const populatedStory = await Story.findById(story._id).populate("author", "name userName profileImage").populate("viewers", "name userName profileImage");

        res.status(200).json(populatedStory);
    }
    catch (error) {
        console.log("Error in view story controller : ", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getStoryByUserName = async (req, res) => {
    try {
        const userName = req.params.userName;

        const user = await User.findOne({ userName });

        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        const story = await Story.findOne({
            author: user._id
        });

        await story.populate([
            { path: "author", select: "userName profileImage" },
            { path: "viewers", select: "userName profileImage" }
        ]);


        return res.status(200).json(story);
    }
    catch (error) {
        console.log("Error in get story by userName controller : ", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const getAllStory = async (req, res) => {
    try {
        const currUser = await User.findById(req.userId);
        const followingIds = currUser.following;

        const stories = await Story.find({
            author: { $in: followingIds }
        })
            .populate("viewers author")
            .sort({ createdAt: -1 });

        res.status(200).json(stories);
    }
    catch (error) {
        console.log("Error in get all story controller : ", error.message);
        res.status(500).json({ message: error.message });
    }
}
