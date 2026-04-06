import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const genToken = async (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1y' });
        return token;
    }
    catch (error) {
        console.log("Error in genToken:", error);
        return res.status(500).json({ message: "Generate token error", error: error.message });
    }
}

export default genToken;