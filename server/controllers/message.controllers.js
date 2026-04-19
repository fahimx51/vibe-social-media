import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.userId;
        const receiverId = req.params.receiverId;
        const { text } = req.body;

        console.log(text);

        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        console.log(image);

        const message = await Message.create({
            sender: senderId,
            receiver: receiverId,
            message: text,
            image
        });

        let conversation = await Conversation.findOne({
            participants: {
                $all: [
                    senderId, receiverId
                ]
            }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                messages: [message._id]
            });
        }
        else {
            conversation.messages.push(message._id);
            await conversation.save();
        }

        res.status(200).json(message);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in send message controller", error.message);
    }
}

export const getAllMessages = async (req, res) => {
    try {
        const senderId = req.userId;
        const receiverId = req.params.receiverId;

        const conversation = await Conversation.findOne({
            participants: {
                $all: [
                    senderId, receiverId
                ]
            }
        }).populate("messages");

        res.status(200).json(conversation);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in get all message controller", error.message);
    }
}

export const getPrevUserChats = async (req, res) => {
    try {
        const conversation = await Conversation.find({
            participants: req.userId,
        }).populate("participants").sort({ updatedAt: -1 });

        res.status(200).json(conversation);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in get previous chats controller", error.message);
    }
}