const dbConfig = require("../dbConfig");
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

  const getSkillIdByName = async (req, res) => {
    try {
      const { skillname } = req.params; // Assuming skillname is passed as a URL parameter
      const skills = await Skill.getSkillIdByName(skillname);
      res.json(skills);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving skills");
    }
  };


  const createVolunteerSkills = async (req, res) => {
    const newVolunteerData = req.body;
    try {
        // Ensure `createVolunteerSkills` method is correctly called
        const createdVolunteerSkill = await Skill.createVolunteerSkills(newVolunteerData);
        res.status(201).json(createdVolunteerSkill); // Return created skill data or a success message
    } catch (error) {
        console.error('Error creating volunteer skill:', error);
        res.status(500).send("Error creating volunteer skill");
    }
};





module.exports = {
    createOppSkills,
    createVolunteerSkills,
    getSkillIdByName,
    updateOppSkills,
    getOpportunitySkillsById
}
