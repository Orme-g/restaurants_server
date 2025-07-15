const mongoose = require("mongoose");
const Review = require("../models/review");
const Restaurant = require("../models/restaurant");
const User = require("../models/user");

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
            .catch((err) => res.status(404).json("Ошибка получения списка отзывов"));
    } catch (e) {
        res.status(500).json("Ошибка сервера");
    }
};

const postRestaurantReview = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const { restaurant, rating, userId } = req.body;
        const review = new Review(req.body);
        await session.withTransaction(async () => {
            await review.save({ session });
            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { reviewedRestaurants: restaurant }, $inc: { reviews: 1 } },
                { session }
            );
            const restaurantObject = await Restaurant.findById(restaurant).session(session);
            if (!restaurantObject) {
                throw new Error("Ресторан не найден!");
            }
            restaurantObject.rating.push(rating);
            await restaurantObject.save({ session });
        });
        res.status(200).json({ message: "Ваш отзыв отправлен!" });
    } catch (e) {
        // handleError(res, e);
        res.status(400).json({ e });
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
            const restaurantObject = await Restaurant.findById(restaurant).session(session);
            restaurantObject.rating.push(rating);
            await restaurantObject.save({ session });
            await Review.findByIdAndUpdate(
                reviewId,
                { $set: { additionalReview: { like, dislike, rating, added: date } } },
                { session }
            );
        });
        res.status(200).json({ message: "Ваш отзыв успешно дополнен!" });
    } catch (error) {
        res.status(500).json("Что-то пошло не так!");
    } finally {
        await session.endSession();
    }
};

module.exports = {
    getRestaurantReviews,
    postRestaurantReview,
    addAdditionalReview,
};
