const mongoose = require("mongoose");
const Review = require("../models/review");
const Restaurant = require("../models/restaurant");

const handleError = (res, error) => {
    res.status(500).json({ error });
};

const getRestaurantReviews = (req, res) => {
    try {
        const { restaurant } = req.params;
        Review.find({ restaurant })
            .sort({ createdAt: -1 })
            .then((reviews) => {
                res.status(200).json(reviews);
            })
            .catch((err) => handleError(res, err));
    } catch (e) {
        handleError(res, e);
    }
};

const postRestaurantReview = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const { restaurant, rating } = req.body;
        const review = new Review(req.body);
        await session.withTransaction(async () => {
            await review.save({ session });
            await Restaurant.findByIdAndUpdate(restaurant, { $push: { rating } }, { session });
        });
        res.status(200).json({ message: "Ваш отзыв отправлен!" });
        // review
        //     .save()
        //     .then(() => {
        //         res.status(200).json({ message: "Ваш отзыв отправлен!" });
        //     })
        //     .catch((err) => handleError(res, err));
        // Restaurant.findByIdAndUpdate(restaurant, {
        //     $push: { rating },
        // })
        //     .then(() => res.status(200))
        //     .catch((error) => handleError(res, error));
    } catch (e) {
        handleError(res, e);
    } finally {
        await session.endSession();
    }
};

const addAdditionalReview = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const { reviewId, like, dislike, rating, restId: restaurant } = req.body;
        const date = new Date();
        await session.withTransaction(async () => {
            await Restaurant.findByIdAndUpdate(restaurant, { $push: { rating } }, { session });
            await Review.findByIdAndUpdate(
                reviewId,
                { $set: { additionalReview: { like, dislike, rating, added: date } } },
                { session }
            );
        });
        res.status(200).json({ message: "Ваш отзыв успешно дополнен!", type: "success" });
        // Restaurant.findByIdAndUpdate(restaurant, {
        //     $push: { rating },
        // })
        //     .then(() =>
        //         Review.findByIdAndUpdate(reviewId, {
        //             $set: { additionalReview: { like, dislike, rating, added: date } },
        //         })
        //     )
        //     .then(() =>
        //         res.status(200).json({ message: "Ваш отзыв успешно дополнен!", type: "success" })
        //     )
        // .catch(() => res.status(500).json({ message: "Что-то пошло не так!", type: "error" }));
    } catch (error) {
        res.status(500).json({ message: "Что-то пошло не так!", type: "error" });
    } finally {
        await session.endSession();
    }
};

module.exports = {
    getRestaurantReviews,
    postRestaurantReview,
    addAdditionalReview,
};
