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

//donovan
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

const deleteOpportunityById = async (req, res) => {
  const oppid = parseInt(req.params.id);
  
    try {
      const success = await Opportunity.deleteOpportunityById(oppid);
      if (!success) {
        return res.status(404).send("Opportunity not found");
      }
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting opportunity");
    }
}

const updateOpportunity = async (req, res) => {
  const oppId = parseInt(req.params.id);
  const newOppData = req.body;

  try {
    const updatedOpp = await Opportunity.updateOpportunity(oppId, newOppData);
    if (!updatedOpp) {
      return res.status(404).send("Opportunity not found");
    }
    res.json(updatedOpp);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating opportunity");
  }
};

//brandon
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

async function searchOpportunity(req, res) {
  const searchTerm = req.query.searchTerm; // Extract search term from query params

  try {    
    const opp = await Opportunity.searchOpportunity(searchTerm);
    res.json(opp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching opportunities" });
  }
}

const getOpportunityByNGOid = async (req, res) => {
  const ngoid = req.params.id;
  try {
    const opportunity = await Opportunity.getOpportunityByNGOid(ngoid)
    if (!opportunity) {
      return res.status(404).send("Opportunity not found")
    }
    res.json(opportunity);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Opportunity");
  }
};

const createOppPhoto = async (req, res) => {
  const oppId = req.params.id;
  const newPhoto = req.file;
  const imagepath = newPhoto.path.slice(6);
  try {
      const opportunity = await Opportunity.createOppPhoto(oppId, imagepath)
      
      if (!opportunity) {
        return res.status(404).send("Opportunity not found");
      }
      res.status(201).json({ photo: imagepath }) //send a OK status code
      //send the new photo path as response
  }
  catch(error) {
      console.error(error)
      res.status(500).send("Error updating Opportunity photo")
  }
}

const updateOppPhoto = async (req, res) => {
  const oppId = req.params.id;
  const newPhoto = req.file;
  const imagepath = newPhoto.path.slice(6);
  try {
      const opportunity = await Opportunity.updateOppPhoto(oppId, imagepath)
      
      if (!opportunity) {
        return res.status(404).send("Opportunity photo not found");
      }
      res.status(201) //send a OK status code
      
  }
  catch(error) {
      console.error(error)
      res.status(500).send("Error updating opportunity photo")
  }
}

module.exports = {
    getAllOpportunities,
    getOpportunityById,
    createOpportunity,
    getOpportunitySkills,
    deleteOpportunityById,
    updateOpportunity,
    incrementOpportunityCurrentVolunteers,
    deleteOpportunityById,
    searchOpportunity,
    getOpportunityByNGOid,
    createOppPhoto,
    updateOppPhoto
}
