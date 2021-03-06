const Book = require('../models/book.model')
const booksdb = require('google-books-search')
var options = {
  key: process.env.GOOGLE_BOOKS_API_KEY
}

module.exports = {
  async addBook(req, response, next) {
    booksdb.search(req.body.book, options, async (err, res) => {
      if (err) {
        return err
      }
      if (res.length === 0) {
        return response.status(411).send('Book Not Found')
      }
      const newBook = res[0]
      let book = await Book.findOne({ bookDBID: newBook.id })
      if (book) {
        req.body.item_id = book._id
        req.body.media_type = 'books'
        req.body.newItemTitle = book.title
        next()
      } else {
        book = new Book({
          title: newBook.title,
          authors: newBook.authors,
          bookDBID: newBook.id,
          genres: newBook.categories,
          image: newBook.thumbnail,
          summary: newBook.description,
          rating: newBook.averageRating,
          release_date: newBook.publishedDate,
          page_count: newBook.page_count,
          mature_rating: newBook.maturityRating
        })
        try {
          book.save(err => {
            if (err) {
              return res.status(500).send(err)
            }
            req.body.item_id = book._id
            req.body.media_type = "books"
            req.body.newItemTitle = book.title
            next()
          })
        } catch (e) {
          res.status(400).send();
        }
      }
    })
  },
  async generateDatalist(req, res) {
    const bookTitle = req.body.title
    let books = []
    try {
      await booksdb.search(bookTitle, options, (err, res) => {
        if (err) {
          return res.status(500).send(err)
        }
        books = res.filter((result, i) => i <= 4)
      })
      res.send(books)
    } catch (e) {
      res.status(400).send(e)
    }
  }
}