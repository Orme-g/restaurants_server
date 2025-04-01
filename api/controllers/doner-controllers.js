const Doner = require("../models/doner");

const handleError = (res, error) => {
    res.status(500).json({ error });
};

const getAllDoners = (req, res) => {
    Doner.find()
        .sort({ createdAt: -1 })
        .then((restaurants) => {
            res.status(200).json(restaurants);
        })
        .catch((err) => handleError(res, err));
};

const getDonerById = (req, res) => {
    Doner.findById(req.params.id)
        .then((restaurants) => {
            res.status(200).json(restaurants);
        })
        .catch((err) => handleError(res, err));
};

const addDonerArticle = (req, res) => {
    try {
        const newArticle = new Doner(req.body);
        newArticle
            .save()
            .then(() => {
                res.status(201).json("Success");
            })
            .catch((error) => handleError(res, error));
    } catch (error) {
        res.status(500).json("Error");
    }
};

module.exports = {
    getAllDoners,
    getDonerById,
    addDonerArticle,
};
