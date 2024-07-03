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




const createBook = async (req, res) => {
    const newBook = req.body;
    try {
        const createdBook = await Book.createBook(newBook)
        res.status(201).json(createdBook)
    }
    catch(error) {
        res.status(500).send("Error creating book")
    }
}







module.exports = {
    getAllBooks,
    updateBookAvailability,
    getBookById,
    createBook
}
