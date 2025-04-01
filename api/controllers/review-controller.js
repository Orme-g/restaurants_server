const Review = require("../models/review");
const Restaurant = require("../models/restaurant");

const handleError = (res, error) => {
    res.status(500).json({ error });
};

const getRestaurantReviews = (req, res) => {
    Review.find({ restaurant: req.params.restaurant })
        .sort({ createdAt: -1 })
        .then((reviews) => {
            res.status(200).json(reviews);
        })
        .catch((err) => handleError(res, err));
};

const postRestaurantReview = (req, res) => {
    const { restaurant, rating } = req.body;
    const review = new Review(req.body);
    review
        .save()
        .then(() => {
            res.status(200).json({ message: "Ваш отзыв отправлен!" });
        })
        .catch((err) => handleError(res, err));
    Restaurant.findByIdAndUpdate(restaurant, {
        $push: { rating },
    })
        .then(() => res.status(200))
        .catch((error) => handleError(res, error));
};

const addAdditionalReview = (req, res) => {
    try {
        const { reviewId, like, dislike, rating, restId: restaurant } = req.body;
        const date = new Date();

        Restaurant.findByIdAndUpdate(restaurant, {
            $push: { rating },
        })
            .then(() =>
                Review.findByIdAndUpdate(reviewId, {
                    $set: { additionalReview: { like, dislike, rating, added: date } },
                })
            )
            .then(() =>
                res.status(200).json({ message: "Ваш отзыв успешно дополнен!", type: "success" })
            )
            .catch(() => res.status(500).json({ message: "Что-то пошло не так!", type: "error" }));
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Что-то пошло не так! Попробуйте позже.", type: "error" });
    }
};

module.exports = {
    getRestaurantReviews,
    postRestaurantReview,
    addAdditionalReview,
};
