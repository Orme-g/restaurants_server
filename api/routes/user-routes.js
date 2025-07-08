const express = require("express");

const {
    getUserData,
    changePassword,
    getReviewedRestaurantsList,
    changeAvatar,
    setBlogerData,
    handleFavouriteRestaurant,
    updateSingleBlogerDataField,
} = require("../controllers/user-controllers");

const router = express.Router();

router.get("/user/getdata/:userId", getUserData);
router.patch("/profile", changePassword);
router.get("/reviewedRestaurants/:userId", getReviewedRestaurantsList);
router.patch("/changeAvatar", changeAvatar);
router.patch("/user/setBlogerData", setBlogerData);
router.patch("/handleFavouriteRestaurant", handleFavouriteRestaurant);
router.patch("/user/update-data-field", updateSingleBlogerDataField);

module.exports = router;
