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
        const { id: commentId, userId, type } = req.body;
        let testId = "123";
        if (type !== "like" && type !== "dislike") {
            return res.status(400).json("Invalid type provided");
        }
        await session.withTransaction(async () => {
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
        res.status(200).json(type === "liked" ? "Liked" : "Disliked");
    } catch (err) {
        handleError(res, err);
    } finally {
        await session.endSession();
    }
};

// Without Transactions
// const __commentEvaluation = (req, res) => {
//     try {
//         const { id: commentId, userId, type } = req.body;

//         switch (type) {
//             case "like":
//                 Comment.findByIdAndUpdate(commentId, { $inc: { likes: 1 } })
//                 .catch((e) =>
//                     handleError(res, e)
//                 );
//                 User.findByIdAndUpdate(userId, {
//                     $addToSet: { ratedComments: commentId },
//                     $inc: { rating: 1 },
//                 })
//                     .then((result) => res.status(200).json(result))
//                     .catch((e) => handleError(res, e));
//                 break;
//             case "dislike":
//                 Comment.findByIdAndUpdate(commentId, { $inc: { dislikes: 1 } }).catch((e) =>
//                     handleError(res, e)
//                 );
//                 User.findByIdAndUpdate(userId, {
//                     $addToSet: { ratedComments: commentId },
//                     $inc: { rating: -1 },
//                 })
//                     .then((result) => res.status(200).json(result))
//                     .catch((e) => handleError(res, e));
//                 break;
//             default:
//                 return;
//         }
//     } catch (err) {
//         handleError(res, err);
//     }
// };

module.exports = {
    getCommentsForTopic,
    getSingleCommentData,
    postComment,
    deleteComment,
    commentEvaluation,
};

// const commentEvaluation = async (req, res) => {
//     const session = await mongoose.startSession();
//     try {
//         const { id: commentId, userId, type } = req.body;
//         if(type !== 'like' || type !== 'dislike') {
//             return res.status(400).json('Invalid type provided')
//         }
//         await session.withTransaction(async () => {
//             const commentUpdateType = type === 'like' ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } }
//             const updateUserRating = type === 'like' ? 1 : -1
//             switch (type) {
//                 case "like":
//                     await Comment.findByIdAndUpdate(commentId, { $inc: { likes: 1 } }, { session });
//                     await User.findByIdAndUpdate(
//                         userId,
//                         {
//                             $addToSet: { ratedComments: commentId },
//                             $inc: { rating: 1 },
//                         },
//                         { session }
//                     );
//                     res.status(200).json("Liked");
//                     break;
//                 case "dislike":
//                     await Comment.findByIdAndUpdate(
//                         commentId,
//                         { $inc: { dislikes: 1 } },
//                         { session }
//                     );
//                     await User.findByIdAndUpdate(
//                         userId,
//                         {
//                             $addToSet: { ratedComments: commentId },
//                             $inc: { rating: -1 },
//                         },
//                         { session }
//                     );
//                     res.status(200).json("Disliked");
//                     break;
//             }
//         });
//     } catch (err) {
//         handleError(res, err);
//     } finally {
//        await session.endSession();
//     }
// };
