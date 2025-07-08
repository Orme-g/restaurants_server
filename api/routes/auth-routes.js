const express = require("express");
const { authMiddleware } = require("../../middleware/middleware");

const {
    registration,
    login,
    cookieMake,
    cookieCheck,
    logout,
    tryThis,
} = require("../controllers/auth-controllers");

const router = express.Router();

router.post("/register", registration);
router.post("/login", login);
router.get("/cookie-make", cookieMake);
router.get("/cookie-check", cookieCheck);
router.get("/logout", logout); // Make POST
router.get("/try", authMiddleware, tryThis);

module.exports = router;
