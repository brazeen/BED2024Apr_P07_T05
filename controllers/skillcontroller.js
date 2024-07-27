const dbConfig = require("../dbConfig");
const Skill = require("../models/skill");

//donovan
const createOppSkills = async (req, res) => {
    const newOppSkills = req.body;
    try {
        const connection = await sql.connect(dbConfig);
        const request = connection.request();
        request.input("skillid", newOppSkills.skillid); 
        request.input("opportunityid", newOppSkills.opportunityid);
    
        const result = await request.query(`
          INSERT INTO OpportunitySkills (skillid, opportunityid) 
          VALUES (@skillid, @opportunityid)
        `);
    
        connection.close();
        res.status(201).json(result); 
      } catch (error) {
        res.status(500).send("Error creating opportunity skills: " + error);
      }
}

const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.getAllSkills()
    res.json(skills)
}
  catch(error) {
    console.error(error)
    res.status(500).send("Error retrieving skills")
}
}

const createVolunteerSkills = async (req, res) => {
  const newVolunteerData = req.body;
  try {
      const createdVolunteerSkill = await Skill.createVolunteerSkills(newVolunteerData)
      res.status(201).json(newVolunteerData)
  }
  catch(error) {
      res.status(500).send("Error creating volunteer skill")
  }
}




module.exports = {
    createOppSkills,
    createVolunteerSkills,
    getAllSkills
}
