import Notification from "../models/notification.model.js"

export const getAllNotification = async (req, res) => {
    try {
        const notification = await Notification.find({ receiver: req.userId })
            .populate("sender receiver").sort({ updatedAt: -1 });
        res.status(200).json(notification);
    }
    catch (error) {
        console.log("Get notification error", error);
        res.status(500).json({ message: 'get notification error' });
    }
}

export const markAsRead = async (req, res) => {
    try {

        const updatedNotifaction = await Notification.updateMany(
            {
                receiver: req.userId,
                isRead: false
            },
            {
                $set: { isRead: true }
            }
        );

        const notification = await Notification.find({ receiver: req.userId }).populate("sender receiver").sort({ updatedAt: -1 });


        res.status(200).json(notification);
    }
    catch (error) {
        console.log("Mark as read error:", error.message);
        res.status(500).json({ message: 'Error updating notifications' });
    }
}