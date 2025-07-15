const express = require("express");
const { authMiddleware } = require("../../middleware/middleware");

const {
    getPostData,
    getSortedPosts,
    getTopAuthors,
    getDataForBadge,
    getUserPosts,
    getPostsByTheme,
    updateLikesOrCommentsCount,
} = require("../controllers/blog-controllers");

const router = express.Router();

router.get("/blog/blog-post/:postId", getPostData);
router.get("/blog/posts/:type", getSortedPosts);
router.get("/blog/top-authors", getTopAuthors);
router.get("/blog/badge-data/:userId", getDataForBadge);
router.get("/blog/user-posts/:userId", getUserPosts);
router.get("/blog/blog-posts/:theme", getPostsByTheme);
router.patch("/blog/update-likes-comments", authMiddleware, updateLikesOrCommentsCount);

module.exports = router;
