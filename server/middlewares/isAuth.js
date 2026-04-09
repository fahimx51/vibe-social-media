import jwt from 'jsonwebtoken';

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;

        next();
    }
    catch (error) {
        console.log("Error in isAuth middleware:", error);
        res.status(500).json({ message: `Authentication error: ${error.message}` });
    }
};

export default isAuth;