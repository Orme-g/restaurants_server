const Doner = require("../models/doner");

const handleError = (res, error) => {
    res.status(500).json({ error });
};

const getAllDoners = (req, res) => {
    try {
        Doner.find()
            .sort({ createdAt: -1 })
            .then((restaurants) => {
                res.status(200).json(restaurants);
            })
            .catch((err) => handleError(res, err));
    } catch (e) {
        handleError(res, e);
    }
};

const getDonerById = (req, res) => {
    try {
        const { id } = req.params;
        Doner.findById(id)
            .then((restaurants) => {
                res.status(200).json(restaurants);
            })
            .catch((err) => handleError(res, err));
    } catch (e) {
        handleError(res, e);
    }
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
