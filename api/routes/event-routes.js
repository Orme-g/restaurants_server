const express = require("express");

const { getEvent, getRestaurantEvents, addNewEvent } = require("../controllers/event-controllers");

const router = express.Router();

router.get("/event/:id", getEvent);
router.get("/event/restaurant/:id", getRestaurantEvents);
router.post("/event/addEvent", addNewEvent);

module.exports = router;
