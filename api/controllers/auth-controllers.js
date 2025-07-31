const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret =
    process.env.JWT_SECRET ??
    (() => {
        throw new Error("JWT_SECRET key is not provided");
    });

const handleError = (res, error) => {
    res.status(500).json(error);
};
const me = (req, res) => {
    try {
        const userId = req.user.id;
        User.findById(userId)
            .then(({ name, _id, role, username }) =>
                res.status(200).json({ name, _id, role, username })
            )
            .catch((error) => res.status(404).json("User not found"));
    } catch (error) {
        handleError(res, error);
    }
};
const registration = async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = await User.findOne({ username });
        if (newUser) {
            return res.status(400).json("Пользователь с таким именем уже существует");
        }
        const hashPassword = bcrypt.hashSync(password, 10);
        const user = new User({ ...req.body, password: hashPassword });
        user.save()
            .then(res.status(200).json({ message: "Регистрация прошла успешно" }))
            .catch((error) => handleError(res, error));
    } catch (err) {
        res.status(500).json(`Ошибка регистрации. Свяжитесь с поддержкой.`);
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
        return res.status(200).json({
            message: `Здравствуйте, ${user.name}`,
        });
    } catch (err) {
        res.status(500).json(`Ошибка входа ${err}`);
    }
};
const refresh = (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json("Ошибка проверки токена: Токен не найден");
        }
        const decoded = jwt.verify(refreshToken, secret);
        const newAccessToken = jwt.sign({ id: decoded.id }, secret, { expiresIn: "15m" });
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000,
        });
        res.status(200).json({ message: "Token issued" });
    } catch (error) {
        res.status(401).json("Ошибка проверки токена: Токен недействительный");
    }
};
const logout = (req, res) => {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Выход из профиля" });
    } catch (error) {
        handleError(res, error);
    }
};
const clearAccessToken = (req, res) => {
    try {
        res.clearCookie("accessToken");
        res.status(200).json("Access token cleared");
    } catch (error) {
        handleError(res, error);
    }
};
const clearAllTokens = (req, res) => {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json("All tokens cleared");
    } catch (error) {
        handleError(res, error);
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
            // maxAge: 5000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json("Hello, User!");
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
const tryThis = (req, res) => {
    try {
        const userId = req.user.id;

        // res.status(200).json("User logged - ok!");
        res.status(200).json({ message: userId });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    me,
    registration,
    login,
    refresh,
    cookieMake,
    cookieCheck,
    logout,
    tryThis,
    clearAccessToken,
    clearAllTokens,
};
