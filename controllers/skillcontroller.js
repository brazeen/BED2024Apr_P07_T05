const Skill = require("../models/skill");

//donovan
const createOppSkills = async (req, res) => {
  const newOppSkills = req.body;
  try {
      const createdOppSkills = await Skill.createOppSkills(newOppSkills)
      res.status(201).json(createdOppSkills)
  }
  catch(error) {
      res.status(500).send("Error creating opportunity skills")
  }
};

const updateOppSkills = async (req, res) => {
    const id = parseInt(req.params.id);
    const newOppSkillsData = req.body;

    try {
        const updatedOppSkills = await Skill.updateOppSkills(id, newOppSkillsData);
        if (!updatedOppSkills) {
        return res.status(404).send("Opportunity skills not found");
        }
        res.json(updatedOppSkills);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating opportunity skills");
    }
};

const getOpportunitySkillsById = async (req, res) => {
    const opportunityid = req.params.id;
    try {
      const oppSkills = await Skill.getOpportunitySkillsById(opportunityid)
      if (!oppSkills) {
        return res.status(404).send("Opportunity skills not found")
      }
      res.json(oppSkills);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving Opportunity skills");
    }
  };



module.exports = {
    createOppSkills,
    updateOppSkills,
    getOpportunitySkillsById
}
