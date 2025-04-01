const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: String,
    title_image: String,
    subtitle: String,
    restaurantName: String,
    restaurantId: String,
    image: String,
    content: Object,
    short_description: String,
    dateStart: Date,
    dateFinish: Date,
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
