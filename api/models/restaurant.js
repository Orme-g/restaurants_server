const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const restaurantSchema = new Schema(
    {
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
        title_image: String,
        cousine: [
            {
                type: String,
                required: true,
                // lowercase: true,
            },
        ],

        rating: {
            type: [Number],
            default: [],
        },
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
        city: {
            type: String,
            required: true,
        },
        coordinates: { type: String, required: true },
        subway: [{ type: String }],
        events: [String],
        averageRating: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

restaurantSchema.pre("save", function (next) {
    if (this.isModified("rating")) {
        this.averageRating = (
            this.rating.reduce((acc, val) => acc + val, 0) / this.rating.length
        ).toFixed(3);
    }
    next();
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
