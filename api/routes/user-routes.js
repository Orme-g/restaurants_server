const express = require("express");

const { authMiddleware } = require("../../middleware/middleware");

const {
    getUserPublicData,
    getUserProfileData,
    changePassword,
    getReviewedRestaurantsList,
    getFavoriteRestaurantsList,
    getRatedCommentsList,
    changeAvatar,
    setBlogerData,
    handleFavouriteRestaurant,
    updateSingleBlogerDataField,
} = require("../controllers/user-controllers");

const router = express.Router();

router.get("/user/getdata/:userId", getUserPublicData);
router.get("/user/profile/getData", authMiddleware, getUserProfileData);
router.patch("/user/profile/changePassword", changePassword);
router.get("/user/reviewedRestaurants", authMiddleware, getReviewedRestaurantsList);
router.get("/user/favoriteRestaurants", authMiddleware, getFavoriteRestaurantsList);
router.get("/user/ratedComments", authMiddleware, getRatedCommentsList);
router.patch("/user/profile/changeAvatar", changeAvatar);
router.patch("/user/profile/setBlogerData", setBlogerData);
router.patch("/user/handleFavouriteRestaurant", authMiddleware, handleFavouriteRestaurant);
router.patch("/user/profile/updateDataField", updateSingleBlogerDataField);

module.exports = router;
