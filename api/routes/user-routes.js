const express = require("express");

const {
    registration,
    login,
    getUsers,
    getUserData,
    changePassword,
    getReviewedRestaurantsList,
    addReviewedRestaurant,
    changeAvatar,
    setBlogerData,
    handleFavouriteRestaurant,
    updateSingleBlogerDataField,
    // getFavouriteRestNames,
} = require("../controllers/user-controllers");

const router = express.Router();

router.post("/register", registration);
router.post("/login", login);
router.get("/users", getUsers);
router.get("/user/getdata/:userId", getUserData);
router.patch("/profile", changePassword);
router.get("/reviewedRestaurants/:userId", getReviewedRestaurantsList);
router.patch("/addReviewedRestaurant", addReviewedRestaurant);
router.patch("/changeAvatar", changeAvatar);
router.patch("/user/setBlogerData", setBlogerData);
router.patch("/handleFavouriteRestaurant", handleFavouriteRestaurant);
router.patch("/user/update-data-field", updateSingleBlogerDataField);

// router.get("/get-favourite-restaurants-names/:userId", getFavouriteRestNames);

module.exports = router;
