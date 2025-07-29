const express = require("express");
const { getSitemap } = require("../controllers/system-controllers");
const router = express.Router();

router.get("/sitemap.xml", getSitemap);

module.exports = router;
