const express = require("express");

const {
    getRestaurants,
    getRestaurantById,
    addRestaurant,
    getSortedRestaurants,
    findRestaurant,
    searchRestaurant,
    upload,
} = require("../controllers/restaurant-controllers");

const router = express.Router();

router.get("/restaurants", getRestaurants);
router.get("/restaurants/:id", getRestaurantById);
router.post("/restaurants/add", upload.array("images", 12), addRestaurant);
router.get("/sorted-restaurants/:sort", getSortedRestaurants);
router.post("/find-restaurant/selection", findRestaurant);
router.get("/find-restaurant/selection", findRestaurant);
router.get("/search-restaurant/:input", searchRestaurant);

module.exports = router;
