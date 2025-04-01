const mongoose = require('mongoose')


// const Schema = mongoose.Schema  // Схема объекта в бд, если каких-то полей нет, они будут добавлены

const { Schema, model } = mongoose

const movieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    rating: {
        type: String
    },
    genres: [String],
    duration: {
        hours: Number,
        minutes: Number
    },
    reviewes: [{
        name: String,
        text: String
    }]

})

// const Movie = mongoose.model('Movie', movieSchema)  // Создали модель, мангуст будет искать по ней коллекцию, добавив множественное число Movies
const Movie = model('Movie', movieSchema)

module.exports = Movie
