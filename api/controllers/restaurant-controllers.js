const Restaurant = require("../models/restaurant");

const handleError = (res, error) => {
    res.status(400).json({ error });
};

const getRestaurants = (req, res) => {
    try {
        Restaurant.find()
            .sort({ createdAt: -1 })
            .limit(6)
            .then((restaurants) => {
                res.status(200).json(restaurants);
            })
            .catch((e) => res.status(400));
    } catch (e) {
        handleError(res, e);
    }
};

const getRestaurantById = (req, res) => {
    try {
        const { id } = req.params;
        Restaurant.findById(id)
            .then((restaurants) => {
                res.status(200).json(restaurants);
            })
            .catch((e) => res.status(404).json({ e }));
    } catch (e) {
        handleError(res, e);
    }
};

const addRestaurant = (req, res) => {
    try {
        const restaurant = new Restaurant(req.body);
        restaurant
            .save()
            .then(() => {
                res.status(201).json("Success");
            })
            .catch((error) => handleError(res, error));
    } catch (err) {
        res.status(500).json("Error");
    }
};

const getSortedRestaurants = (req, res) => {
    try {
        const { sort } = req.params;
        const { cardsNumber } = req.query;
        const getSortedBy =
            sort === "expensive"
                ? { bill: -1 }
                : sort === "cheap"
                ? { bill: 1 }
                : sort === "best"
                ? { averageRating: -1 }
                : null;
        Restaurant.find()
            .sort(getSortedBy)
            .limit(cardsNumber)
            .then((restaurants) => {
                res.status(200).json(restaurants);
            })
            .catch((err) => handleError(res, err));
    } catch (e) {
        handleError(res, e);
    }
};

const findRestaurant = (req, res) => {
    try {
        const { subway, cousine, sortBy } = req.body;
        const sort = sortBy === "expensive" ? -1 : 1;
        Restaurant.find({ cousine: { $in: cousine }, subway: { $in: [subway] } })
            .sort({ bill: sort })
            .then((restaurants) => {
                if (restaurants.length > 0) {
                    return res.status(200).json(restaurants);
                } else {
                    return res.status(200).json(null);
                }
            })
            .catch((err) => handleError(res, err));
    } catch (e) {
        handleError(res, e);
    }
};

const searchRestaurant = (req, res) => {
    try {
        const { input } = req.params;
        Restaurant.find(
            {
                name: { $regex: RegExp(input), $options: "i" },
            },
            { name: 1, _id: 1 }
        ).then((result) => res.status(200).json(result));
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    getRestaurants,
    getRestaurantById,
    addRestaurant,
    getSortedRestaurants,
    findRestaurant,
    searchRestaurant,
};
