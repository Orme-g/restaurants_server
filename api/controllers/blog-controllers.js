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
        if (type === "top") {
            BlogPost.find()
                .sort({ likes: -1 })
                .limit(4)
                .then((result) => res.status(200).json(result))
                .catch((error) => handleError(res, error));
        }
        if (type === "last") {
            BlogPost.find()
                .sort({ createdAt: -1 })
                .limit(9)
                .then((result) => res.status(200).json(result))
                .catch((error) => handleError(res, error));
        }
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
            .then((result) => {
                return result.blogData;
            })
            .then((data) => res.status(200).json(data))
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

const updateLikesOrCommentsCount = (req, res) => {
    try {
        const { postId, field, userId } = req.body;
        switch (field) {
            case "likes":
                BlogPost.findByIdAndUpdate(postId, { $inc: { likes: 1 } })
                    .then(() => {})
                    .catch((error) => handleError(res, error));
                User.findByIdAndUpdate(userId, { $addToSet: { ratedBlogPosts: postId } })
                    .then((result) => res.status(200).json(result))
                    .catch((error) => handleError(res, error));
                break;
            default:
        }
    } catch (error) {
        handleError(res, error);
    }
};

const getAllPosts = (req, res) => {
    // BlogPost.find().then((result) => res.status(200).json(result));
    // return res.status(200).json("All ok");
};

module.exports = {
    getPostData,
    getSortedPosts,
    getAllPosts,
    getTopAuthors,
    getDataForBadge,
    getUserPosts,
    getPostsByTheme,
    updateLikesOrCommentsCount,
};
