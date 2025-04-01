const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogPostSchema = new Schema({
    userId: String,
    title: String,
    subtitle: String,
    title_image: String,
    short_description: String,
    content: Object,
    themes: Array,
    likes: Number,
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
});

const BlogPost = mongoose.model("blog_posts", blogPostSchema);

module.exports = BlogPost;
