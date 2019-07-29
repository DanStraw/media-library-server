const faker = require('faker')
const Movie = require('../models/movie.model')

module.exports = {
  seedData() {
    Movie.countDocuments((err, count) => {
      if (count > 0) {
        return;
      }

      this.createMovies()
    })
  },
  createMovies() {
    let movies = [];

    Array.from(Array(process.env.numberOfMovies)).forEach(() => {
      movies.push({
        title: faker.lorem.sentence(6),
        format: faker.lorem.sentence(2)
      })
    })

    Movie.insertMany(movies, (err, savedMovies) => {
      console.log(savedMovies)
    })
  },
}