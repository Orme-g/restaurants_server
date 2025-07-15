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
router.patch("/user/profile", changePassword);
router.get("/user/reviewedRestaurants/:userId", getReviewedRestaurantsList);
router.patch("/user/changeAvatar", changeAvatar);
router.patch("/user/setBlogerData", setBlogerData);
router.patch("/user/handleFavouriteRestaurant", handleFavouriteRestaurant);
router.patch("/user/update-data-field", updateSingleBlogerDataField);

module.exports = router;
