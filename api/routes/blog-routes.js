const express = require("express");

const {
    getPostData,
    getAllPosts,
    getSortedPosts,
    getTopAuthors,
    getDataForBadge,
    getUserPosts,
    getPostsByTheme,
    updateLikesOrCommentsCount,
} = require("../controllers/blog-controllers");

const router = express.Router();

router.get("/blog/blog-post/:postId", getPostData);
router.get("/blog/allPosts", getAllPosts);
router.get("/blog/posts/:type", getSortedPosts);
router.get("/blog/top-authors", getTopAuthors);
router.get("/blog/badge-data/:userId", getDataForBadge);
router.get("/blog/user-posts/:userId", getUserPosts);
router.get("/blog/blog-posts/:theme", getPostsByTheme);
router.patch("/blog/update-likes-comments", updateLikesOrCommentsCount);

module.exports = router;
