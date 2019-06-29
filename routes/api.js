const express = require("express")
const router = express.Router()
const movieService = require('../services/movie.service');

router.get("/movies", movieService.getAll.bind(movieService))
router.get("/movies/:movieId", movieService.getById.bind(movieService))
router.post("/movies", movieService.addMovie.bind(movieService))
router.delete('/movies/:movieID', movieService.deleteMovie.bind(movieService))

module.exports = router