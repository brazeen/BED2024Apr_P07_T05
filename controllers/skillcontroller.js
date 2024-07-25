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



module.exports = {
    createOppSkills
}
