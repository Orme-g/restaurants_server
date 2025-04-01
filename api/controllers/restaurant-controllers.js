const Restaurant = require("../models/restaurant");

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
    Restaurant.findById(req.params.id)
        .then((restaurants) => {
            res.status(200).json(restaurants);
        })
        .catch((err) => handleError(res, err));
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
    // const subway = "Старая Деревня";
    // const cousine = ["Французская", "Японская", "Итальянская"];
    Restaurant.find({ cousine: { $in: cousine }, subway: { $in: [subway] } })
        // Restaurant.find({ cousine: { $in: cousine } })
        .sort({ bill: sort })
        .then((restaurants) => {
            if (restaurants.length > 0) {
                return res.status(200).json(restaurants);
            } else {
                return res.status(200).json(null);
            }
        })
        // .then((restaurants) => res.status(200).json(restaurants))
        .catch((err) => handleError(res, err));
};

const getRestNamesAndIds = (req, res) => {
    Restaurant.find()
        .then((result) =>
            result.map((rest) => {
                return { name: rest.name, id: rest._id };
            })
        )
        .then((result) => res.status(200).json(result))
        .catch((e) => res.status(500).json("Server error :("));
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
