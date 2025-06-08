const express = require("express");

const {
    getCommentsForTopic,
    getSingleCommentData,
    postComment,
    deleteComment,
    commentEvaluation,
} = require("../controllers/coment-controllers");

const router = express.Router();

router.get("/comments/:topic", getCommentsForTopic);
router.get("/comments/single-comment/:commentId", getSingleCommentData);
router.post("/comments", postComment);
router.patch("/comments/delete-comment", deleteComment);
router.patch("/comments/evaluate-comment", commentEvaluation);

module.exports = router;
