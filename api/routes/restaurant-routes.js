const express = require("express");
const { authMiddleware } = require("../../middleware/middleware");

const {
    getLastAddedRestaurants,
    getRestaurantById,
    addNewRestaurant,
    getSortedRestaurants,
    findRestaurant,
    searchRestaurant,
    upload,
    getRestaurantReviews,
    postRestaurantReview,
    addAdditionalReview,
} = require("../controllers/restaurant-controllers");

const router = express.Router();

router.get("/restaurants/getLastAddedRestaurants", getLastAddedRestaurants);
router.get("/restaurants/:id", getRestaurantById);
router.post("/restaurants/addNewRestaurant", upload.array("images", 12), addNewRestaurant);
router.get("/sorted-restaurants/:sort", getSortedRestaurants);
router.post("/find-restaurant/selection", findRestaurant);
router.get("/search-restaurant/:input", searchRestaurant);
router.get("/restaurant/reviews/:restaurant", getRestaurantReviews);
router.post("/restaurant/reviews/postReview", authMiddleware, postRestaurantReview);
router.patch("/restaurant/reviews/addAdditional", authMiddleware, addAdditionalReview);

module.exports = router;
