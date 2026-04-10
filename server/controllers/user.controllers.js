import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        res.status(200).json({ user });
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

        res.status(200).json({ users });
    }
    catch (error) {
        console.log("Error occur in suggested users controller:", error);
        res.status(500).json({ message: `Get suggested users error: ${error.message}` });
    }
}