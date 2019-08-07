const Book = require('../models/book.model')

module.exports = {
  async addBook(req, res, next) {
    let book = await Book.findOne({ bookDBID: req.body.book.id })
    if (book) {
      req.body.book_id = book._id
      next()
    } else {
      book = new Book({
        title: req.body.book.title,
        authors: req.body.book.authors,
        bookDBID: req.body.book.id,
        genres: req.body.book.categories,
        image: req.body.book.thumbnail,
        summary: req.body.book.description,
        rating: req.body.book.averageRating,
        release_date: req.body.book.publishedDate,
        page_count: req.body.book.page_count,
        mature_rating: req.body.book.maturityRating
      })
      try {
        book.save(err => {
          if (err) {
            return res.status(500).send(err)
          }
          req.body.item_id = book._id
          req.body.media_type = "books"
          next()
        })
      } catch (e) {
        res.status(400).send();
      }
    }
  }
}