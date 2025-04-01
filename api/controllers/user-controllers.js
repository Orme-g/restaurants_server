const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { secret } = require("../../config");

const generateAccessToken = (id) => {
    const payload = {
        id,
    };
    return jwt.sign(payload, secret, { expiresIn: "24h" });
};

const handleError = (res, error) => {
    res.status(500).json(error);
};

const getUsers = (req, res) => {
    User.find()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => handleError(res, error));
};

const getUserData = (req, res) => {
    try {
        User.findById(req.params.userId)
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

const registration = async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = await User.findOne({ username });
        if (newUser) {
            return res.status(400).json("Пользователь с таким именем уже существует");
        }
        const hashPassword = bcrypt.hashSync(password, 7);
        const user = new User({ ...req.body, password: hashPassword });
        user.save()
            .then(res.status(200).json({ message: "Регистрация прошла успешно" }))
            .catch((error) => handleError(res, error));
    } catch (err) {
        res.status(500).json(`Ошибка регистрации ${err}`);
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json("Неверный логин или пароль");
        }
        const checkPassword = bcrypt.compareSync(password, user.password);
        if (!checkPassword) {
            return res.status(400).json("Неверный логин или пароль");
        }
        const { name, avatar, status, _id, registeredAt, comments, reviews, email, role } = user;
        const token = generateAccessToken(_id);
        return res.status(200).json({
            token,
            name,
            username,
            avatar,
            status,
            _id,
            registeredAt,
            comments,
            reviews,
            email,
            login,
            role,
            message: `Здравствуйте, ${name}`,
        });
    } catch (err) {
        res.status(500).json(`Ошибка входа ${err}`);
    }
};

const changePassword = async (req, res) => {
    try {
        const { userId, oldPass, newPass } = req.body;
        const user = await User.findOne({ _id: userId });
        const checkPassword = bcrypt.compareSync(oldPass, user.password);
        if (!checkPassword) {
            res.status(400).json("Неверный пароль");
        } else {
            const hashPassword = bcrypt.hashSync(newPass, 7);
            User.findByIdAndUpdate(userId, { $set: { password: hashPassword } })
                .then(() => res.status(200).json("Пароль успешно изменён"))
                .catch((err) => res.status(500).json({ err }));
        }

        // res.status(200).json(user)
    } catch (error) {
        handleError(res, error);
    }
};

const changeAvatar = async (req, res) => {
    try {
        const { userId, avatarData } = req.body;
        User.findByIdAndUpdate(userId, { $set: { avatar: avatarData } })
            .then(() => res.status(200).json("Аватар успешно изменён"))
            .catch((err) => res.status(500).json({ err }));
    } catch (error) {
        handleError(res, error);
    }
};

const getReviewedRestaurantsList = (req, res) => {
    User.findById(req.params.userId)
        .then((user) => res.status(200).json(user.reviewedRestaurants))
        .catch((error) => handleError(res, error));
};

const addReviewedRestaurant = (req, res) => {
    try {
        const { userId, restId } = req.body;
        User.findByIdAndUpdate(userId, {
            $addToSet: { reviewedRestaurants: restId },
            $inc: { reviews: 1 },
        })
            .then(() => res.status(200))
            .catch((error) => handleError(res, error));
    } catch (error) {
        handleError(res, error);
    }
};

const handleFavouriteRestaurant = (req, res) => {
    try {
        const { userId, restId, type } = req.body;
        switch (type) {
            case "add":
                User.findByIdAndUpdate(userId, {
                    $addToSet: { favouriteRestaurants: restId },
                })
                    .then(() =>
                        res.status(200).json({ message: "Добавлен в избранное", type: "success" })
                    )
                    .catch((error) => handleError(res, error));
                break;
            case "remove":
                User.findByIdAndUpdate(userId, { $pull: { favouriteRestaurants: restId } })
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
    getUsers,
    getUserData,
    registration,
    login,
    changePassword,
    getReviewedRestaurantsList,
    addReviewedRestaurant,
    changeAvatar,
    setBlogerData,
    handleFavouriteRestaurant,
    updateSingleBlogerDataField,
    // getFavouriteRestNames,
};
