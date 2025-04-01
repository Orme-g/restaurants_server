const express = require("express");

const {
    getRestaurantReviews,
    postRestaurantReview,
    addAdditionalReview,
} = require("../controllers/review-controller");

const router = express.Router();

router.get("/reviews/:restaurant", getRestaurantReviews);
router.post("/reviews", postRestaurantReview);
router.patch("/reviews/addAdditional", addAdditionalReview);

module.exports = router;
