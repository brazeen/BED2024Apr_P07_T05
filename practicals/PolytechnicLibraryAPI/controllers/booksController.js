const Book = require("../models/book")

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.getAllBooks()
        res.json(books)
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error retrieving books")
    }
}

const getBookById = async (req, res) => {
    const bookId = parseInt(req.params.id);
    try {
      const book = await Book.getBookById(bookId);
      if (!book) {
        return res.status(404).send("Book not found");
      }
      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving book");
    }
  };

const updateBookAvailability = async (req, res) => {
    const bookid = req.params.id;
    const newAvailability = req.params.availability;
    try {
        const book = await Book.updateBookAvailability(bookid, newAvailability)
        if (!book) {
          return res.status(404).send("Book not found");
        }       
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error updating book")
    }
}








module.exports = {
    getAllBooks,
    updateBookAvailability,
}
