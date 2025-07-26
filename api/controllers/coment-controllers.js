const mongoose = require("mongoose");
const Comment = require("../models/comment");
const User = require("../models/user");

const handleError = (res, error) => {
    res.status(500).json({ error });
};

const getCommentsForTopic = (req, res) => {
    try {
        Comment.find({ topic: req.params.topic })
            .sort({ createdAt: -1 })
            .then((comments) => {
                res.status(200).json(comments);
            })
            .catch((err) => handleError(res, err));
    } catch (e) {
        handleError(res, e);
    }
};
const getSingleCommentData = (req, res) => {
    try {
        const id = req.params.commentId;
        Comment.findById(id)
            .then((commentData) => res.status(200).json(commentData))
            .catch(() => res.status(500));
    } catch (e) {
        handleError(res, e);
    }
};

const postComment = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const userId = req.user.id;
        const comment = new Comment(req.body);
        if (!userId) {
            return res.status(400).json("User id not provided!");
        }
        comment.userId = userId;
        await session.withTransaction(async () => {
            await comment.save({ session });
            await User.findByIdAndUpdate(
                userId,
                {
                    $inc: { comments: 1 },
                },
                { session }
            );
        });
        res.status(201).json({ message: "Комментарий успешно добавлен" });
    } catch (e) {
        res.status(500).json("Комментарий не добавлен. Что-то пошло не так...");
    } finally {
        await session.endSession();
    }
};

const deleteComment = (req, res) => {
    try {
        const { id, reason } = req.body;
        Comment.findByIdAndUpdate(id, { $set: { text: reason, deleted: true } })
            .then(() => {
                res.status(200).json({ message: "Комментарий успешно удалён" });
            })
            .catch(() => res.status(500).json("Что-то пошло не так..."));
    } catch (e) {
        handleError(res, e);
    }
};

const commentEvaluation = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const userId = req.user.id;
        const { id: commentId, type } = req.body;
        if (type !== "like" && type !== "dislike") {
            return res.status(400).json("Invalid type provided");
        }
        await session.withTransaction(async () => {
            // Если хотим внутри транзакции вернуть ошибку, то только
            // через throw new Error('Error text'), если мы будем использовать
            // res.status(500).json("Error"), то это не откатит транзакцию, так как не будет
            // считаться за ошибку, а будет намеренным ответом
            // Comment.findByIdAndUpdate({}).catch() - нельзя, так как мы перехватим ошибку раньше транзакции
            // и она может повести себя неправильно
            const commentUpdateType =
                type === "like" ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } };
            const updateUserRating = type === "like" ? 1 : -1;

            await Comment.findByIdAndUpdate(commentId, commentUpdateType, { session });
            await User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: { ratedComments: commentId },
                    $inc: { rating: updateUserRating },
                },
                { session }
            );
        });
        // Ответы res.status().json() только вне тела транзакций, чтобы не нарушать логику работы транзакций
        res.status(200).json({ message: type === "liked" ? "Liked" : "Disliked" });
    } catch (err) {
        handleError(res, err);
    } finally {
        await session.endSession();
    }
};

module.exports = {
    getCommentsForTopic,
    getSingleCommentData,
    postComment,
    deleteComment,
    commentEvaluation,
};
