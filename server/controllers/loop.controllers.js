import Loop from '../models/loop.model.js';
import User from '../models/user.model.js';

export const getAllLoops = async (req, res) => {
    try {
        const loops = await Loop.find({}).populate("author", "name userName, profileImage").populate("comments.author");
        res.status(200).json(loops);
    }
    catch (error) {
        console.log("Error in get all loops controller : ", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const uploadLoop = async (req, res) => {
    try {
        const { caption } = req.body;

        let media;

        if (req.file) {
            media = await uploadOnCloudinary(req.file.path);
        }
        else {
            return res.status(400).json({ message: "Media is required" });
        }

        const loop = await Loop.create({
            caption, media, author: req.userId
        });

        const user = await User.findById(req.userId);
        user.loops.push(loop._id);
        await user.save();

        const populatedLoop = await Loop.findById(loop._id).populate("author", "name userName, profileImage");

        res.status(201).json(populatedLoop);
    }
    catch (error) {
        console.log("Error in upload loop controller : ", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const like = async (req, res) => {
    try {
        const loopId = req.params.loopId;
        const loop = await Loop.findById(loopId);

        if (!loop) {
            return res.status(400).json({ message: "Loop not found!" });
        }

        const alreadyLiked = loop.likes.some(id => id.toString() === req.userId.toString());

        if (alreadyLiked) {
            post.likes = loop.likes.filter(id => id.toString() !== req.userId.toString())
        }
        else {
            loop.likes.push(req.userId);
        }

        await loop.save();

        await loop.populate("author", "name userName, profileImage");

        res.status(200).json(loop);
    }
    catch (error) {
        console.log("Error in loop like controller : ", error.message);
        res.status(500).json({ message: error.message });
    }
}
export const comment = async (req, res) => {
    try {
        const { text } = req.body;
        const loopId = req.params.postId;

        const loop = await Post.findById(loopId);

        if (!loop) {
            return res.status(400).json({ message: "loop not found!" });
        }

        loop.comments.push({
            author: req.userId,
            text
        });

        await loop.save();
        await loop.populate("author", "name userName, profileImage");
        await loop.populate("comments.author");
        res.status(200).json(post);
    }
    catch (error) {
        console.log("Error in loop comment controller : ", error.message);
        res.status(500).json({ message: error.message });
    }
};

// export const saved = async (req, res) => {
//     try {
//         const postId = req.params.postId;

//         const user = await User.findById(req.userId);

//         const alreadySaved = user.savedPosts.some(id => id.toString() === postId.toString());

//         if (alreadySaved) {
//             user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId.toString())
//         }
//         else {
//             user.savedPosts.push(postId);
//         }

//         await user.save();
//         await user.populate("savedPosts");

//         res.status(200).json(user);
//     }
//     catch (error) {
//         console.log("Error in get saved controller : ", error.message);
//         res.status(500).json({ message: error.message });
//     }
// }