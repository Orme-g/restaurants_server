const User = require("../models/user");
const bcrypt = require("bcrypt");

const handleError = (res, error) => {
    res.status(500).json(error);
};

const getUserPublicData = (req, res) => {
    try {
        const { userId } = req.params;
        User.findById(userId)
            .then(({ avatar, name, username, comments, reviews }) => {
                res.status(200).json({
                    avatar,
                    name,
                    username,
                    comments,
                    reviews,
                });
            })
            .catch((error) => res.status(500).json("Ошибка"));
    } catch (e) {
        res.status(500).json(`Что-то пошло не так ${e}`);
    }
};

const getUserBlogPublicData = async (req, res) => {
    try {
        const { userId } = req.params;
        User.findById(userId)
            .then(({ blogData }) => res.status(200).json(blogData))
            .catch((error) => res.status(500).json("Server error"));
    } catch (error) {
        handleError(res, error);
    }
};

const getUserProfileData = (req, res) => {
    try {
        const userId = req.user.id;
        User.findById(userId)
            .select("-password -__v")
            .lean()
            .then((userData) => res.status(200).json(userData))
            .catch((error) => res.status(404).json("User not found"));
    } catch (error) {
        handleError(res, error);
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPass, newPass } = req.body;
        const { password } = await User.findOne({ _id: userId });
        const checkPassword = bcrypt.compareSync(oldPass, password);
        if (!checkPassword) {
            return res.status(400).json("Неверный пароль");
        }
        const hashPassword = bcrypt.hashSync(newPass, 7);
        User.findByIdAndUpdate(userId, { $set: { password: hashPassword } })
            .then(() => res.status(200).json({ message: "Пароль успешно изменён" }))
            .catch((err) => res.status(500).json({ err }));
    } catch (error) {
        handleError(res, error);
    }
};

const changeAvatar = (req, res) => {
    try {
        const userId = req.user.id;
        const { avatarData } = req.body;
        User.findByIdAndUpdate(userId, { $set: { avatar: avatarData } })
            .then(() => res.status(200).json({ message: "Аватар успешно изменён" }))
            .catch((err) => res.status(500).json("Что-то пошло не так..."));
    } catch (error) {
        handleError(res, error);
    }
};

const getReviewedRestaurantsList = (req, res) => {
    try {
        const userId = req.user.id;
        User.findById(userId)
            .then(({ reviewedRestaurants }) => res.status(200).json(reviewedRestaurants))
            .catch((error) => handleError(res, error));
    } catch (error) {
        handleError(res, error);
    }
};

const getFavoriteRestaurantsList = (req, res) => {
    try {
        const userId = req.user.id;
        User.findById(userId)
            .then(({ favouriteRestaurants }) => res.status(200).json(favouriteRestaurants))
            .catch((error) => res.status(500).json("Server error"));
    } catch (error) {
        handleError(res, error);
    }
};

const getRatedCommentsList = (req, res) => {
    try {
        const userId = req.user.id;
        User.findById(userId)
            .then(({ ratedComments }) => res.status(200).json(ratedComments))
            .catch((error) => res.status(500).json("Server error"));
    } catch (error) {
        handleError(res, error);
    }
};

const getRatedBlogPosts = (req, res) => {
    try {
        const userId = req.user.id;
        User.findById(userId)
            .then(({ ratedBlogPosts }) => res.status(200).json(ratedBlogPosts))
            .catch((error) => res.status(500).json("Server error"));
    } catch (error) {
        handleError(res, error);
    }
};

const handleFavouriteRestaurant = (req, res) => {
    try {
        const userId = req.user.id;
        const { restId, type, name } = req.body;
        switch (type) {
            case "add":
                User.findByIdAndUpdate(userId, {
                    $addToSet: { favouriteRestaurants: [name, restId] },
                })
                    .then(() => res.status(200).json({ message: "Добавлен в избранное" }))
                    .catch((error) => res.status(500).json("Ошибка сервера."));
                break;
            case "remove":
                User.findByIdAndUpdate(userId, {
                    $pull: { favouriteRestaurants: { $elemMatch: { $eq: restId } } },
                })
                    .then(() => res.status(200).json({ message: "Убран из избранного" }))
                    .catch((error) => res.status(500).json("Ошибка сервера."));
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
        const userId = req.user.id;
        const { blogerName, blogCity, aboutMe, blogAvatar } = req.body;
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
            .then(() => res.status(200).json({ message: "Вы зарегистрированы в Блоге" }))
            .catch((error) => handleError(res, error));
    } catch (e) {
        res.status(500).json(`Error: ${e}`);
    }
};

const updateSingleBlogerDataField = (req, res) => {
    try {
        const userId = req.user.id;
        const { field, data } = req.body;
        switch (field) {
            case "aboutMe":
                User.findByIdAndUpdate(userId, { $set: { "blogData.aboutMe": data } })
                    .then(() => res.status(200).json({ message: "Поле успешно изменено" }))
                    .catch((error) => handleError(res, error));
                break;
            case "blogCity":
                User.findByIdAndUpdate(userId, { $set: { "blogData.blogCity": data } })
                    .then(() => res.status(200).json({ message: "Поле успешно изменено" }))
                    .catch((error) =>
                        res.status(500).json("Не удалось изменить поле. Ошибка сервера")
                    );
                break;
            default:
        }
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    getUserPublicData,
    getUserBlogPublicData,
    getUserProfileData,
    changePassword,
    getReviewedRestaurantsList,
    getFavoriteRestaurantsList,
    getRatedCommentsList,
    getRatedBlogPosts,
    changeAvatar,
    setBlogerData,
    handleFavouriteRestaurant,
    updateSingleBlogerDataField,
};
