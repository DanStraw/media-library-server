const express = require("express");
const router = express.Router();
const userService = require('../services/user.service');
const movieService = require('../services/movie.service');
const auth = require('../middleware/auth')

router.get("/movies", movieService.getAll.bind(movieService))
router.get("/movies/:movieId", movieService.getById.bind(movieService))
router.put("/movies/:movieId", movieService.updateViews.bind(movieService))
router.post("/movies", auth, movieService.addMovie.bind(movieService), userService.addMovieToUser.bind(userService))
router.delete('/movies/:movieID', movieService.deleteMovie.bind(movieService))

router.post('/users', userService.createUser.bind(userService));
router.get('/users', userService.getAll.bind(userService));
router.post('/user/login', userService.loginUser.bind(userService));
router.post('/user/logout', auth, userService.logoutUser.bind(userService));
router.get('/users/:id', userService.getById.bind(userService))
router.patch('/users/movieUpdate', userService.updateMovieViewCount.bind(userService))

module.exports = router