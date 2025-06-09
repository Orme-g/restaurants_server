const Event = require("../models/event");

const handleError = (res, error) => {
    res.status(500).json({ error });
};

const getEvent = (req, res) => {
    try {
        const { id: eventId } = req.params;
        Event.findById(eventId)
            .then((event) => res.status(200).json(event))
            .catch((error) => handleError(res, error));
    } catch (e) {
        handleError(res, e);
    }
};

const getRestaurantEvents = (req, res) => {
    try {
        const { id: restaurantId } = req.params;
        Event.find({ restaurantId })
            .sort({ createdAt: -1 })
            .then((result) => res.status(200).json(result))
            .catch((error) => handleError(res, error));
    } catch (e) {
        handleError(res, e);
    }
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
