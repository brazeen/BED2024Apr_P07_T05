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
}



module.exports = {
    createOppSkills
}
