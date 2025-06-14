const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    name: {
        type: String,
        default: "Гость",
    },
    userId: String,
    topic: String,
    likes: Number,
    dislikes: Number,
    text: String,
    replyToComment: String,
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    deleted: Boolean,
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
