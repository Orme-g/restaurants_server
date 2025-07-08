const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { secret } = require("../../config");

const handleError = (res, error) => {
    res.status(500).json(error);
};
const getUserData = (req, res) => {
    try {
        const { userId } = req.params;
        User.findById(userId)
            .then(
                ({
                    avatar,
                    name,
                    registeredAt,
                    username,
                    email,
                    comments,
                    reviews,
                    favouriteRestaurants,
                    ratedComments,
                    _id,
                    bloger,
                    blogData,
                    ratedBlogPosts,
                }) => {
                    res.status(200).json({
                        avatar,
                        name,
                        registeredAt,
                        username,
                        email,
                        comments,
                        reviews,
                        favouriteRestaurants,
                        ratedComments,
                        _id,
                        bloger,
                        blogData,
                        ratedBlogPosts,
                    });
                }
            )
            .catch((error) => res.status(500).json("Ошибка"));
    } catch (e) {
        res.status(500).json(`Что-то пошло не так ${e}`);
    }
};

const changePassword = async (req, res) => {
    try {
        const { userId, oldPass, newPass } = req.body;
        const { password } = await User.findOne({ _id: userId });
        const checkPassword = bcrypt.compareSync(oldPass, password);
        if (!checkPassword) {
            return res.status(400).json("Неверный пароль");
        }
        const hashPassword = bcrypt.hashSync(newPass, 7);
        User.findByIdAndUpdate(userId, { $set: { password: hashPassword } })
            .then(() => res.status(200).json("Пароль успешно изменён"))
            .catch((err) => res.status(500).json({ err }));
    } catch (error) {
        handleError(res, error);
    }
};

const changeAvatar = (req, res) => {
    try {
        const { userId, avatarData } = req.body;
        User.findByIdAndUpdate(userId, { $set: { avatar: avatarData } })
            .then(() => res.status(200).json("Аватар успешно изменён"))
            .catch((err) => res.status(500).json("Что-то пошло не так..."));
    } catch (error) {
        handleError(res, error);
    }
};

const getReviewedRestaurantsList = (req, res) => {
    try {
        const { userId } = req.params;
        User.findById(userId)
            .then(({ reviewedRestaurants }) => res.status(200).json(reviewedRestaurants))
            .catch((error) => handleError(res, error));
    } catch (error) {
        handleError(res, error);
    }
};

const handleFavouriteRestaurant = (req, res) => {
    try {
        const { userId, restId, type, name } = req.body;
        switch (type) {
            case "add":
                User.findByIdAndUpdate(userId, {
                    $addToSet: { favouriteRestaurants: [name, restId] },
                })
                    .then(() =>
                        res.status(200).json({ message: "Добавлен в избранное", type: "success" })
                    )
                    .catch((error) => handleError(res, error));
                break;
            case "remove":
                User.findByIdAndUpdate(userId, {
                    $pull: { favouriteRestaurants: { $elemMatch: { $eq: restId } } },
                })
                    .then(() =>
                        res.status(200).json({ message: "Убран из избранного", type: "warning" })
                    )
                    .catch((error) => handleError(res, error));
                break;
            default:
                break;
        }
    } catch (error) {
        handleError(res, error);
    }
};
const setBlogerData = async (req, res) => {
    try {
        const { blogerName, blogCity, aboutMe, blogAvatar, userId } = req.body;
        const checkUsername = await User.findOne({ "blogData.blogerName": blogerName });
        if (checkUsername) {
            return res.status(400).json("Имя уже занято");
        }
        User.findByIdAndUpdate(userId, {
            $set: {
                blogData: {
                    blogerName,
                    blogCity,
                    aboutMe,
                    blogAvatar,
                    blogPosts: [],
                    blogPostsCount: 0,
                    blogerRating: 0,
                },
                bloger: true,
            },
        })
            .then(() =>
                res.status(200).json({ message: "Вы зарегистрированы в Блоге", type: "success" })
            )
            .catch((error) => handleError(res, error));
    } catch (e) {
        res.status(500).json(`Error: ${e}`);
    }
};

const updateSingleBlogerDataField = (req, res) => {
    try {
        const { userId, field, data } = req.body;
        switch (field) {
            case "aboutMe":
                User.findByIdAndUpdate(userId, { $set: { "blogData.aboutMe": data } })
                    .then(() => res.status(200).json("Field Updated"))
                    .catch((error) => handleError(res, error));
                break;
            case "blogCity":
                User.findByIdAndUpdate(userId, { $set: { "blogData.blogCity": data } })
                    .then(() => res.status(200).json("Field Updated"))
                    .catch((error) => handleError(res, error));
                break;
            default:
        }
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    getUserData,
    changePassword,
    getReviewedRestaurantsList,
    changeAvatar,
    setBlogerData,
    handleFavouriteRestaurant,
    updateSingleBlogerDataField,
};
