const rateLimit = require("express-rate-limit");

const rateLimitMiddleware = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: "Слишком много неудачных попыток входа. Повторите попытку через 10 минут.",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req, res) => {
        return req.body.username;
    },
    skipSuccessfulRequests: true,
});

module.exports = {
    rateLimitMiddleware,
};
