const express = require('express')
const { 
    getMovies,
    getMovieById,
    deleteMovie,
    postMovie,
    updateMovie
} = require('../controllers/movie-controllers')

const router = express.Router()

router.get('/movies', getMovies)
router.get('/movies/:id', getMovieById)
router.delete('/movies/:id', deleteMovie)
router.post('/movies', postMovie)
router.patch('/movies/:id', updateMovie)

module.exports = router