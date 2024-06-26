const Volunteer = require("../models/volunteer")

//brandon
const getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.getAllVolunteers()
        res.json(volunteers)
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error retrieving volunteers")
    }
}

const getVolunteerById = async (req, res) => {
  const volunteerid = req.params.id;
  try {
    const volunteer = await Volunteer.getVolunteerById(volunteerid);
    if (!volunteer) {
      return res.status(404).send("Volunteer not found")
    }
    res.json(volunteer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Volunteer");
  }
};

//brandon
const deleteVolunteer = async (req, res) => {
    const volunteerId = req.params.id;
    try {
        const volunteer = await Volunteer.deleteVolunteer(volunteerId);
        if (!volunteer) {
          return res.status(404).send("Volunteer not found");
        }
        res.status(204).send()
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error deleting volunteer")
    }
}

async function getVolunteerSkills(req, res) {
    const volId = parseInt(req.params.id);
    try {
      const skills = await Volunteer.getVolunteerSkills(volId);
      res.json(skills);
    } catch (error) {
      console.error(error); 
      res.status(500).json({ message: "Error fetching volunteer's skill" });
    }
}
/*
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
    getAllVolunteers,
    getVolunteerById,
    deleteVolunteer,
    getVolunteerSkills,
}
