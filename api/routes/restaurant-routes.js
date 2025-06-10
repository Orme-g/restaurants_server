const express = require("express");
const {
    getRestaurants,
    getRestaurantById,
    addRestaurant,
    getSortedRestaurants,
    findRestaurant,
    searchRestaurant,
} = require("../controllers/restaurant-controllers");

const router = express.Router();

router.get("/restaurants", getRestaurants);
router.get("/restaurants/:id", getRestaurantById);
router.post("/restaurants/add", addRestaurant);
router.get("/sorted-restaurants/:sort", getSortedRestaurants);
router.post("/find-restaurant/selection", findRestaurant);
router.get("/find-restaurant/selection", findRestaurant);
router.get("/search-restaurant/:input", searchRestaurant);

module.exports = router;
