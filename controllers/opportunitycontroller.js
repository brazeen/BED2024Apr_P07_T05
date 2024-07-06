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
      if (!skills) {
        res.status(404).send("Opportunity skills not found")
      }
      res.json(skills);
    } catch (error) {
      console.error(error); 
      res.status(500).json({ message: "Error fetching opportunity's skill" });
    }
}

async function incrementOpportunityCurrentVolunteers(req, res) {
  const oppId = parseInt(req.params.id);
  try {
    const opp = await Opportunity.incrementOpportunityCurrentVolunteers(oppId)
    if (!opp) {
      res.status(404).send("Opportunity not found")
    }
    res.status(200).json(opp)
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Error updating opportunity" });
  }
}

module.exports = {
    getAllOpportunities,
    getOpportunityById,
    createOpportunity,
    getOpportunitySkills,
    incrementOpportunityCurrentVolunteers
}
