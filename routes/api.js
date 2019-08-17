const express = require("express");
const router = express.Router();
const albumService = require('../services/album.service');
const bookService = require('../services/book.service');
const gameService = require('../services/game.service');
const movieService = require('../services/movie.service');
const userService = require('../services/user.service');

const auth = require('../middleware/auth')

router.post("/albums", auth, albumService.addAlbum.bind(albumService), userService.addToUserLibrary.bind(userService));
router.post("/albums/datalist", albumService.generateDatalist.bind(albumService));

router.post('/books', auth, bookService.addBook.bind(bookService), userService.addToUserLibrary.bind(userService));

router.post("/games", auth, gameService.addGame.bind(gameService), userService.addToUserLibrary.bind(userService));

router.get("/movies", movieService.getAll.bind(movieService));
router.get("/movies/:movieId", movieService.getById.bind(movieService));
router.post("/movies", auth, movieService.addMovie.bind(movieService), userService.addToUserLibrary.bind(userService));

router.post('/users', userService.createUser.bind(userService));
router.get('/users', userService.getAll.bind(userService));

router.post('/user/login', userService.loginUser.bind(userService));
router.post('/user/logout', auth, userService.logoutUser.bind(userService));
router.get('/user/:id/:type', userService.getById.bind(userService));
router.put('/user/updateCount', userService.updateCount.bind(userService));
router.delete('/user/deleteItem', userService.deleteItem.bind(userService));

module.exports = router