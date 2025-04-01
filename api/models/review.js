const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    name: String,
    avatar: String,
    like: String,
    dislike: String,
    rating: Number,
    restaurant: String,
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    userId: String,
    additionalReview: {
        like: String,
        dislike: String,
        rating: Number,
        added: Date,
    },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
