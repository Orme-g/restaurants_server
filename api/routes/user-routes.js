const express = require("express");

const { authMiddleware } = require("../../middleware/middleware");

const {
    getUserPublicData,
    getUserBlogPublicData,
    getUserProfileData,
    changePassword,
    getReviewedRestaurantsList,
    getFavoriteRestaurantsList,
    getRatedCommentsList,
    getRatedBlogPosts,
    changeAvatar,
    setBlogerData,
    handleFavouriteRestaurant,
    updateSingleBlogerDataField,
} = require("../controllers/user-controllers");

const router = express.Router();

router.get("/user/getdata/:userId", getUserPublicData);
router.get("/user/blogData/:userId", getUserBlogPublicData);
router.get("/user/profile/getData", authMiddleware, getUserProfileData);
router.patch("/user/profile/changePassword", authMiddleware, changePassword);
router.get("/user/reviewedRestaurants", authMiddleware, getReviewedRestaurantsList);
router.get("/user/favoriteRestaurants", authMiddleware, getFavoriteRestaurantsList);
router.get("/user/ratedComments", authMiddleware, getRatedCommentsList);
router.get("/user/ratedBlogPosts", authMiddleware, getRatedBlogPosts);
router.patch("/user/profile/changeAvatar", authMiddleware, changeAvatar);
router.patch("/user/profile/setBlogerData", authMiddleware, setBlogerData);
router.patch("/user/handleFavouriteRestaurant", authMiddleware, handleFavouriteRestaurant);
router.patch("/user/profile/updateDataField", authMiddleware, updateSingleBlogerDataField);

module.exports = router;
