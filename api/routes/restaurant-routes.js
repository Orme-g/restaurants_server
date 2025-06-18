const express = require("express");

const {
    getRestaurants,
    getRestaurantById,
    addRestaurant,
    getSortedRestaurants,
    findRestaurant,
    searchRestaurant,
    uploadRestaurantImages,
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
router.post("/upload", upload.array("images", 12), uploadRestaurantImages);

module.exports = router;
