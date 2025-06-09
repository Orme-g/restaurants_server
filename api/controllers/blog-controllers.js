const mongoose = require("mongoose");
const BlogPost = require("../models/blogPost");
const User = require("../models/user");

const handleError = (res, error) => {
    res.status(500).json({ error });
};

const getPostData = (req, res) => {
    try {
        const { postId } = req.params;
        BlogPost.findById(postId)
            .then((result) => res.status(200).json(result))
            .catch((e) => handleError(res, e));
    } catch (e) {
        res.status(500).json(e);
    }
};

const getSortedPosts = (req, res) => {
    try {
        const { type } = req.params;
        const { number } = req.query;
        if (type !== "top" && type !== "last") {
            return res.status(401).json("Invalid type provided");
        }
        const sortByType = type === "top" ? { likes: -1 } : { createdAt: -1 };
        BlogPost.find()
            .sort(sortByType)
            .limit(+number)
            .then((result) => res.status(200).json(result))
            .catch((error) => handleError(res, error));
    } catch (e) {
        res.status(500).json(e);
    }
};

const getTopAuthors = (req, res) => {
    try {
        User.find({ bloger: true })
            .sort({ "blogData.blogerRating": -1 })
            .limit(4)
            .then((result) => result.map((item) => item._id))
            .then((result) => res.status(200).json(result))
            .catch((error) => handleError(res, error));
    } catch (e) {
        res.status(500).json(e);
    }
};

const getDataForBadge = (req, res) => {
    try {
        const { userId } = req.params;
        User.findById(userId)
            .then(({ blogData }) => res.status(200).json(blogData))
            .catch((error) => handleError(res, error));
    } catch (e) {
        handleError(res, e);
    }
};

const getUserPosts = (req, res) => {
    try {
        const { userId } = req.params;
        BlogPost.find({ userId })
            .then((result) => res.status(200).json(result))
            .catch((error) => handleError(res, error));
    } catch (e) {
        res.status(500).json(e);
    }
};

const getPostsByTheme = (req, res) => {
    try {
        const { theme } = req.params;
        BlogPost.find({ themes: { $in: theme } })
            .then((result) => res.status(200).json(result))
            .catch((error) => handleError(res, error));
    } catch (e) {
        res.status(500).json(e);
    }
};

const updateLikesOrCommentsCount = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const { postId, field, userId } = req.body;

        await session.withTransaction(async () => {
            if (field === "like") {
                await BlogPost.findByIdAndUpdate(postId, { $inc: { likes: 1 } }, { session });
                await User.findByIdAndUpdate(
                    userId,
                    { $addToSet: { ratedBlogPosts: postId } },
                    { session }
                );
            } else {
                return res.status(500).json("Unknown type of action");
            }
        });
        res.status(200).json("You liked the post!");
    } catch (error) {
        handleError(res, error);
    } finally {
        await session.endSession();
    }
};

module.exports = {
    getPostData,
    getSortedPosts,
    getTopAuthors,
    getDataForBadge,
    getUserPosts,
    getPostsByTheme,
    updateLikesOrCommentsCount,
};
