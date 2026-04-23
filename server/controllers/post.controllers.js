import uploadOnCloudinary from '../config/cloudinary.js';
import Notification from '../models/notification.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { getSocketId, io } from '../socket.js';
export const uploadPost = async (req, res) => {
    try {
        const { caption, mediaType } = req.body;

        let media;

        if (req.file) {
            media = await uploadOnCloudinary(req.file.buffer, req.file.mimetype);
        }
        else {
            return res.status(400).json({ message: "Media is required" });
        }

        const post = await Post.create({
            caption, media, mediaType, author: req.userId
        });

        const user = await User.findById(req.userId);
        user.posts.push(post._id);
        await user.save();

        const populatedPost = await Post.findById(post._id).populate("author", "name userName, profileImage");

        res.status(201).json(populatedPost);
    }
    catch (error) {
        console.log("Error in post controller : ", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate("author", "name userName profileImage").populate("comments.author", "name userName profileImage").sort({ createdAt: -1 });
        res.status(200).json(posts);
    }
    catch (error) {
        console.log("Error in get all posts controller : ", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const like = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({ message: "Post not found!" });
        }

        const alreadyLiked = post.likes.some(id => id.toString() === req.userId.toString());

        if (alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() !== req.userId.toString())
        }
        else {
            post.likes.push(req.userId);
            if (post.author._id != req.userId) {
                const notification = await Notification.create({
                    sender: req.userId,
                    receiver: post.author._id,
                    type: 'like',
                    post: post._id,
                    message: "liked your post"
                });

                const populatedNotification = await Notification.findById(notification._id)
                    .populate("sender");

                const receiverSocketId = getSocketId(post.author._id);

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification);
                }
            }
        }

        await post.save();

        // await post.populate("author", "name userName profileImage");

        await post.populate("author comments.author");

        io.emit("likedPost", {
            postId: post._id,
            likes: post.likes
        });


        res.status(200).json(post);
    }
    catch (error) {
        console.log("Error in get like controller : ", error.message);
        res.status(500).json({ message: error.message });
    }
}
export const comment = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.postId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({ message: "Post not found!" });
        }

        post.comments.push({
            author: req.userId,
            text
        });

        if (post.author._id != req.userId) {
            const notification = await Notification.create({
                sender: req.userId,
                receiver: post.author._id,
                type: 'comment',
                post: post._id,
                message: "commented on your post"
            });

            const populatedNotification = await Notification.findById(notification._id)
                .populate("sender");

            const receiverSocketId = getSocketId(post.author._id);

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", populatedNotification);
            }
        }

        await post.save();
        await post.populate("author", "name userName, profileImage");
        await post.populate("comments.author");

        io.emit("commentPost", {
            postId: post._id,
            comments: post.comments
        });

        res.status(200).json(post);
    }
    catch (error) {
        console.log("Error in get comment controller : ", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const saved = async (req, res) => {
    try {
        const postId = req.params.postId;
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Toggle Logic
        const alreadySaved = user.savedPosts.some(id => id.toString() === postId.toString());

        if (alreadySaved) {
            user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId.toString());
        } else {
            user.savedPosts.push(postId);
        }

        await user.save();

        // CORRECT WAY to populate an existing document instance:
        await user.populate([
            { path: "followers following loops", select: "name userName profileImage" },
            {
                path: "posts",
                populate: {
                    path: "comments.author",
                    select: "userName profileImage"
                }
            },
            {
                path: "savedPosts",
                populate: [
                    { path: "author", select: "userName profileImage" },
                    { path: "comments.author", select: "userName profileImage" }
                ]
            }
        ]);

        res.status(200).json(user);
    }
    catch (error) {
        console.log("Error in saved controller:", error.message);
        res.status(500).json({ message: error.message });
    }
};