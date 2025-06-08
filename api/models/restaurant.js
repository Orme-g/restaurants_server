const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true,
        uppercase: true,
    },
    short_description: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
            required: true,
        },
    ],
    cousine: [
        {
            type: String,
            required: true,
            // lowercase: true,
        },
    ],

    rating: [Number],
    adress: {
        type: String,
        required: true,
    },
    bill: {
        type: Number,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    city: {
        type: String,
        required: true,
    },
    coordinates: { type: String, required: true },
    subway: [{ type: String }],
    events: [String],
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
