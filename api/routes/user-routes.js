const express = require("express");

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

module.exports = router;
