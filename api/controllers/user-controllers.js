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
        const accessToken = jwt.sign({ id: user._id }, secret, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user._id }, secret, { expiresIn: "30d" });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        const { name, avatar, status, _id, registeredAt, comments, reviews, email, role } = user;
        // const token = generateAccessToken(_id);
        return res.status(200).json({
            accessToken,
            refreshToken,
            // token,
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
const cookieMake = (req, res) => {
    try {
        const accessToken = jwt.sign({ id: "222333" }, secret, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: "222333" }, secret, { expiresIn: "30d" });
        // res.status(200).json({ accessToken, refreshToken });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.json("Hello, User!");
    } catch (error) {
        handleError(req, error);
    }
};
const cookieCheck = (req, res) => {
    try {
        const access = req.cookies?.accessToken;
        const refresh = req.cookies?.refreshToken;
        res.status(200).json(`Wow, reply! Access Token: ${access}; RefreshToken: ${refresh}`);
    } catch (error) {
        handleError(res, error);
    }
};
const logout = (req, res) => {
    try {
        res.clearCookie(
            "accessToken"
            //     , {
            //     httpOnly: true,
            //     secure: true,
            //     sameSite: "Strict",
            // }
        );
        res.clearCookie(
            "refreshToken"
            //     , {
            //     httpOnly: true,
            //     secure: true,
            //     sameSite: "Strict",
            // }
        );
        res.status(200).json("Lol");
    } catch (error) {
        handleError(res, error);
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
const tryThis = (req, res) => {
    res.status(200).json("User logged - ok!");
};

module.exports = {
    getUserData,
    registration,
    login,
    changePassword,
    getReviewedRestaurantsList,
    changeAvatar,
    setBlogerData,
    handleFavouriteRestaurant,
    updateSingleBlogerDataField,
    cookieMake,
    cookieCheck,
    logout,
    tryThis,
};
