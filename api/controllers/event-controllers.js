const Event = require("../models/event");

const handleError = (res, error) => {
    res.status(500).json({ error });
};

const getEvent = (req, res) => {
    const eventId = req.params.id;
    Event.findById(eventId)
        .then((event) => res.status(200).json(event))
        .catch((error) => handleError(res, error));
};

const getRestaurantEvents = (req, res) => {
    const restaurantId = req.params.id;
    Event.find({ restaurantId })
        .sort({ createdAt: -1 })
        .then((result) => res.status(200).json(result))
        .catch((error) => handleError(res, error));
};

const addNewEvent = (req, res) => {
    try {
        const newEvent = new Event(req.body);
        newEvent
            .save()
            .then(() => res.status(201).json("Success"))
            .catch((error) => res.status(500).json(error));
    } catch (e) {
        handleError(res, e);
    }
};

module.exports = {
    getEvent,
    getRestaurantEvents,
    addNewEvent,
};
