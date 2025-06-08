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

const postComment = (req, res) => {
    try {
        const comment = new Comment(req.body);
        const { userId } = req.body;
        User.findByIdAndUpdate(userId, {
            $inc: { comments: 1 },
        }).then(() => {
            comment
                .save()
                .then(() => {
                    res.status(201).json({ message: "success" });
                })
                .catch((err) => handleError(res, err));
        });
    } catch (e) {
        handleError(res, e);
    }
};

const deleteComment = (req, res) => {
    try {
        const { id, reason } = req.body;
        // Comment.findByIdAndDelete(req.params.id)
        Comment.findByIdAndUpdate(id, { $set: { text: reason, deleted: true } })
            .then(() => {
                res.status(200).json({ message: "Комментарий успешно удалён" });
            })
            .catch(() => res.status(500).json("Что-то пошло не так..."));
    } catch (e) {
        handleError(res, e);
    }
};

const likeComment = (req, res) => {
    try {
        Comment.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } })
            .then(() => res.status(200).json("Liked"))
            .catch((err) => handleError(res, err));
    } catch (e) {
        handleError(res, e);
    }
};

const dislikeComment = (req, res) => {
    try {
        Comment.findByIdAndUpdate(req.params.id, { $inc: { dislikes: 1 } })
            .then((result) => res.status(200).json(result))
            .catch((err) => handleError(res, err));
    } catch (e) {
        handleError(res, e);
    }
};
const evaluateComment = (req, res) => {
    try {
        const { type, id: commentId, userId } = req.body;
        switch (type) {
            case "like":
                Comment.findByIdAndUpdate(commentId, { $inc: { likes: 1 } })
                    .then(() => {})
                    .catch((e) => handleError(res, e));
                User.findByIdAndUpdate(userId, {
                    $addToSet: { ratedComments: commentId },
                    $inc: { rating: 1 },
                })
                    .then((result) => res.status(200).json(result))
                    .catch((e) => handleError(res, e));
                break;
            case "dislike":
                Comment.findByIdAndUpdate(commentId, { $inc: { dislikes: 1 } }).then(() => {});
                User.findByIdAndUpdate(userId, {
                    $addToSet: { ratedComments: commentId },
                    $inc: { rating: -1 },
                })
                    .then((result) => res.status(200).json(result))
                    .catch((e) => handleError(res, e));
                break;
            default:
                return;
        }
    } catch (err) {
        handleError(res, err);
    }
};

module.exports = {
    getCommentsForTopic,
    getSingleCommentData,
    postComment,
    deleteComment,
    likeComment,
    dislikeComment,
    evaluateComment,
};
