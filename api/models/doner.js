const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const donerSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    subtitle: String,
    title_image: String,
    short_description: {
        type: String,
        required: true,
    },
    content: Object,
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    author: String,
    rating: {
        type: Number,
        required: true,
    },
});

const Doner = mongoose.model("Doner", donerSchema);

module.exports = Doner;
