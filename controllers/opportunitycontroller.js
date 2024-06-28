const Opportunity = require("../models/opportunity")

//brandon
const getAllOpportunities = async (req, res) => {
    try {
        const opportunities = await Opportunity.getAllOpportunities()
        res.json(opportunities)
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error retrieving opportunities")
    }
}

const getOpportunityById = async (req, res) => {
  const opportunityid = req.params.id;
  try {
    const opportunity = await Opportunity.getOpportunityById(opportunityid)
    if (!opportunity) {
      return res.status(404).send("Opportunity not found")
    }
    res.json(opportunity);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Opportunity");
  }
};


const createOpportunity = async (req, res) => {
  const newOpp = req.body;
  try {
      const createdOpp = await Opportunity.createOpportunity(newOpp)
      res.status(201).json(createdOpp)
  }
  catch(error) {
      res.status(500).send("Error creating opportunity")
  }
}


async function getOpportunitySkills(req, res) {
    const oppId = parseInt(req.params.id);
    try {
      const skills = await Opportunity.getOpportunitySkills(oppId)
      res.json(skills);
    } catch (error) {
      console.error(error); 
      res.status(500).json({ message: "Error fetching opportunity's skill" });
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
    getAllOpportunities,
    getOpportunityById,
    createOpportunity,
    getOpportunitySkills
}
