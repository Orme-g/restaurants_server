const express = require("express");
const { authMiddleware } = require("../../middleware/middleware");

const {
    registration,
    login,
    refresh,
    cookieMake,
    cookieCheck,
    logout,
    tryThis,
} = require("../controllers/auth-controllers");

const router = express.Router();

router.post("/auth/register", registration);
router.post("/auth/login", login);
router.post("/auth/refresh", refresh);
router.post("/auth/cookie-make", cookieMake);
router.get("/auth/cookie-check", cookieCheck);
router.post("/auth/logout", logout);
router.get("/auth/try", authMiddleware, tryThis);

module.exports = router;
