const express = require("express");
const { authMiddleware } = require("../../middleware/middleware");

const {
    registration,
    login,
    getUserData,
    changePassword,
    getReviewedRestaurantsList,
    changeAvatar,
    setBlogerData,
    handleFavouriteRestaurant,
    updateSingleBlogerDataField,
    cookieCheck,
    cookieMake,
    logout,
    tryThis,
} = require("../controllers/user-controllers");

const router = express.Router();

router.post("/register", registration);
router.post("/login", login);
router.get("/user/getdata/:userId", getUserData);
router.patch("/profile", changePassword);
router.get("/reviewedRestaurants/:userId", getReviewedRestaurantsList);
router.patch("/changeAvatar", changeAvatar);
router.patch("/user/setBlogerData", setBlogerData);
router.patch("/handleFavouriteRestaurant", handleFavouriteRestaurant);
router.patch("/user/update-data-field", updateSingleBlogerDataField);
router.get("/cookie-make", cookieMake);
router.get("/cookie-check", cookieCheck);
router.get("/logout", logout); // Make POST
router.get("/try", authMiddleware, tryThis);

module.exports = router;
