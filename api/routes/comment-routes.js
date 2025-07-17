const express = require("express");
const { authMiddleware } = require("../../middleware/middleware");
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
router.post("/comments/post-comment", postComment);
router.patch("/comments/delete-comment", deleteComment);
router.patch("/comments/evaluate-comment", authMiddleware, commentEvaluation);

module.exports = router;
