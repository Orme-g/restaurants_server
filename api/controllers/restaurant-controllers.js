const Restaurant = require("../models/restaurant");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const { normalizeArrayFields } = require("../../utils/normalizeArrayFields");

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

//Uploading restaurant images to NAS

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.restaurantFolderPath) {
            return cb(null, req.restaurantFolderPath);
        }
        const { name } = req.body;
        let counter = 1;
        const baseFolderName = slugify(name, {
            replacement: "_",
            remove: /[*+~.()'"!:@]/g,
            lower: true,
            strict: true,
            trim: true,
        });
        // let dir = path.join("/Users/ila/static", baseFolderName); // Local tests
        let dir = path.join("/weats/restaurants", baseFolderName); // For Web
        while (fs.existsSync(dir)) {
            dir = path.join("/weats/restaurants", baseFolderName); // For web
            // dir = path.join("/Users/ila/static", `${baseFolderName}-${counter}`); //Local tests
            counter += 1;
        }
        fs.mkdirSync(dir, { recursive: true });
        req.restaurantFolder = path.basename(dir);
        req.restaurantFolderPath = dir;
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 12,
    },
});

const addRestaurant = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        normalizeArrayFields(req.body, ["subway", "cousine"]);
        const folderName = req.restaurantFolder;
        const files = req.files;
        const {
            name,
            short_description,
            description,
            cousine,
            adress,
            bill,
            phone,
            city,
            coordinates,
            subway,
            titleImageName,
        } = req.body;
        const urls = files.map(
            (file) => `https://weats.ru/api/images/restaurants/${folderName}/${file.originalname}`
        );
        const title_image = `https://weats.ru/api/images/restaurants/${folderName}/${titleImageName}`;
        const result = await session.withTransaction(async () => {
            const restaurantData = {
                name,
                short_description,
                description,
                cousine,
                adress,
                bill,
                phone,
                city,
                coordinates,
                subway,
                title_image,
                images: urls,
            };
            const restaurant = new Restaurant(restaurantData);
            await restaurant.save({ session });
            return restaurant;
        });
        res.status(201).json({ message: "success" });
    } catch (error) {
        console.error("Error when creating new Restaurant", error);
        if (req.restaurantFolderPath && fs.existsSync(req.restaurantFolderPath)) {
            fs.rmSync(req.restaurantFolderPath, { recursive: true, force: true });
        }
        res.status(500).json({ message: "error", error: error.message });
    } finally {
        session.endSession();
    }
};

module.exports = {
    getRestaurants,
    getRestaurantById,
    addRestaurant,
    getSortedRestaurants,
    findRestaurant,
    searchRestaurant,
    upload,
};
