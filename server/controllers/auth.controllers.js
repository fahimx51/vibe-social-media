import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import genToken from "../config/token.js";
import sendMail from "../config/mail.js";

export const signUp = async (req, res) => {
    try {
        const { name, userName, email, password } = req.body;

        const findUserByEmail = await User.findOne({ email });

        if (findUserByEmail) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const findUserByUsername = await User.findOne({ userName });

        if (findUserByUsername) {
            return res.status(400).json({ message: "Username already in use" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, userName, email, password: hashedPassword
        });

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1 * 365 * 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: "none"
        });

        res.status(201).json({ message: "User created successfully", user });

    }
    catch (error) {
        console.log("Error in signUp:", error);
        res.status(500).json({ message: `Sign up error: ${error.message}` });
    }
};
export const signIn = async (req, res) => {
    try {
        const { userName, password } = req.body;

        const user = await User.findOne({ userName });

        if (!user) {
            return res.status(400).json({ message: "Invalid username" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1 * 365 * 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: "none"
        });

        res.status(201).json({ message: "User signed in successfully", user });

    }
    catch (error) {
        console.log("Error in signIn:", error);
        res.status(500).json({ message: `Sign In error: ${error.message}` });
    }
};
export const signOut = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "User signed out successfully" });
    }
    catch (error) {
        console.log("Error in signOut:", error);
        res.status(500).json({ message: `Sign Out error: ${error.message}` });
    }
};
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false;

        await user.save();
        await sendMail(email, otp);

        return res.status(200).json({ message: "OTP send to your email" });
    }

    catch (error) {
        console.log("Failed to send otp:", error);
        res.status(500).json({ message: `Failed to send otp: ${error.message}` });
    }

};
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or Expired OTP" });
        }

        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "OTP verified successfully" });
    }
    catch (error) {
        console.log("Failed to verify otp:", error);
        res.status(500).json({ message: `Failed to verify otp: ${error.message}` });
    }
}
export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "otp verification is required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.isOtpVerified = false;
        await user.save();

        return res.status(200).json({ message: "password updated successfully" });
    }

    catch (error) {
        console.log("Failed to update password:", error);
        res.status(500).json({ message: `Failed to update password: ${error.message}` });
    }
}