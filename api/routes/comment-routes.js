const express = require("express");

const {
    getCommentsForTopic,
    getSingleCommentData,
    postComment,
    deleteComment,
    likeComment,
    dislikeComment,
    evaluateComment,
} = require("../controllers/coment-controllers");

const router = express.Router();

router.get("/comments/:topic", getCommentsForTopic);
router.get("/comments/single-comment/:commentId", getSingleCommentData);
router.post("/comments", postComment);
router.patch("/comments/:id", deleteComment);
router.patch("/comments/like/:id", likeComment);
router.patch("/comments/dislike/:id", dislikeComment);
router.patch("/comments/evaluate", evaluateComment);

module.exports = router;
