const jwt = require("jsonwebtoken");
const secret =
    process.env.JWT_SECRET ??
    (() => {
        throw new Error("JWT_SECRET key is not provided");
    });

const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Unauthorized");
    }
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json("Forbidden: Invalid token");
    }
};

module.exports = {
    authMiddleware,
};
