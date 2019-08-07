const express = require("express");
const router = express.Router();
const userService = require('../services/user.service');
const movieService = require('../services/movie.service');
const bookService = require('../services/book.service');
const auth = require('../middleware/auth')

router.post('/users', userService.createUser.bind(userService));
router.get('/users', userService.getAll.bind(userService));

router.post('/user/login', userService.loginUser.bind(userService));
router.post('/user/logout', auth, userService.logoutUser.bind(userService));
router.get('/user/:id/:type', userService.getById.bind(userService))
router.put('/user/updateCount', userService.updateCount.bind(userService))
router.delete('/user/deleteItem', userService.deleteItem.bind(userService))

router.get("/movies", movieService.getAll.bind(movieService))
router.get("/movies/:movieId", movieService.getById.bind(movieService))
router.post("/movies", auth, movieService.addMovie.bind(movieService), userService.addToUserLibrary.bind(userService))

router.post('/books', auth, bookService.addBook.bind(bookService), userService.addToUserLibrary.bind(userService))

module.exports = router