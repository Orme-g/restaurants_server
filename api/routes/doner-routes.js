const express = require("express");

const { getAllDoners, getDonerById, addDonerArticle } = require("../controllers/doner-controllers");

const router = express.Router();

router.get("/best-doner/", getAllDoners);
router.get("/best-doner/:id", getDonerById);
router.post("/best-doner/add", addDonerArticle);

module.exports = router;
