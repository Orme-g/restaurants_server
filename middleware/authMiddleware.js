const jwt = require("jsonwebtoken");
const { secret } = require("../config");

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
