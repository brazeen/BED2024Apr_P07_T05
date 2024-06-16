const NGO = require("../models/ngo")

const getAllNGOs = async (req, res) => {
    try {
        const ngos = await NGO.getAllNGOs()
        res.json(ngos)
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error retrieving NGOs")
    }
}

const getNGOsByStatus = async (req, res) => {
    const ngostatus = req.params.status;
    try {
      const ngos = await NGO.getNGOsByStatus(ngostatus);
      res.json(ngos);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving NGOs");
    }
};

const deleteNGO = async (req, res) => {
    const NGOId = req.params.id;
    try {
        const NGO = await NGO.deleteNGO(NGOId);
        if (!NGO) {
          return res.status(404).send("NGO not found");
        }
        res.status(204).send()
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error deleting NGO")
    }
}
/*


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

const updateBook = async (req, res) => {
    const bookId = req.params.id;
    const newBookData = req.body;
    try {
        const book = await Book.updateBook(bookId, newBookData);
        if (!book) {
          return res.status(404).send("Book not found");
        }
        
    }
    catch(error) {
        console.error(error)
        res.status(500).send("EError updating book")
    }
}



*/

module.exports = {
    getAllNGOs,
    getNGOsByStatus,
    deleteNGO,
}
