const Restaurant = require("../models/restaurant");
const User = require("../models/user");

const handleError = (res, error) => {
    res.status(500).json({ error });
};

const getRestaurants = (req, res) => {
    Restaurant.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .then((restaurants) => {
            res.status(200).json(restaurants);
        })
        .catch((err) => handleError(res, err));
};

const getRestaurantById = (req, res) => {
    try {
        Restaurant.findById(req.params.id)
            .then((restaurants) => {
                res.status(200).json(restaurants);
            })
            // .catch((err) => handleError(res, err));
            .catch(() => res.status(404));
    } catch (e) {
        handleError(res, e);
    }
};

const deleteRestaurant = (req, res) => {
    Restaurant.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => handleError(res, err));
};

const addRestaurant = (req, res) => {
    try {
        const restaurant = new Restaurant(req.body); // Добавляем новый элемент который берем из тела запроса
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

const updateRestaurant = (req, res) => {
    Restaurant.findByIdAndUpdate(req.params.id, req.body) // (id документа, новые данные)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => handleError(res, err));
};

const getSortedRestaurants = (req, res) => {
    let sortType;
    switch (req.params.sort) {
        case "expensive":
            sortType = { bill: -1 };
            break;
        case "cheap":
            sortType = { bill: 1 };
            break;
        case "best":
            sortType = { rating: -1 };
            break;
        default:
            sortType = null;
    }
    Restaurant.find()
        .sort(sortType)
        .limit(10)
        .then((restaurants) => {
            res.status(200).json(restaurants);
        })
        .catch((err) => handleError(res, err));
};

const findRestaurant = (req, res) => {
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
};

const getRestNamesAndIds = (req, res) => {
    const userId = req.params.userId;
    User.findById(userId)
        .then((result) => {
            let restPairs = [];
            if (result.favouriteRestaurants.length > 0) {
                result.favouriteRestaurants.forEach((item) => {
                    Restaurant.findById(item).then((result) => {
                        restPairs.push([result.name, result._id]);
                        // console.log(restPairs);
                    });
                });
            }
            return restPairs;
        })
        .then((result) => console.log(result));
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
    deleteRestaurant,
    addRestaurant,
    updateRestaurant,
    getSortedRestaurants,
    findRestaurant,
    getRestNamesAndIds,
    searchRestaurant,
};
