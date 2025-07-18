const express = require("express");
const { authMiddleware } = require("../../middleware/middleware");

const {
    me,
    registration,
    login,
    refresh,
    cookieMake,
    cookieCheck,
    logout,
    tryThis,
    clearAccessToken,
    clearAllTokens,
} = require("../controllers/auth-controllers");

const router = express.Router();
router.get("/auth/me", authMiddleware, me);
router.post("/auth/register", registration);
router.post("/auth/login", login);
router.post("/auth/refresh", refresh);
router.post("/auth/cookie-make", cookieMake);
router.get("/auth/cookie-check", cookieCheck);
router.post("/auth/logout", logout);
router.get("/auth/try", authMiddleware, tryThis);
router.post("/auth/clearAccessToken", clearAccessToken);
router.post("/auth/clearAllTokens", clearAllTokens);

module.exports = router;
