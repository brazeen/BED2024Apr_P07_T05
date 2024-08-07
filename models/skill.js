const sql = require("mssql")
const dbConfig = require("../dbConfig");

class Skill {
    constructor(skillid, skillname, volunteerid) {
        this.volunteerid = volunteerid
        this.skillid = skillid;
        this.skillname = skillname;
    }

    static async getSkillIdByName(skillname) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Skills WHERE skillname = @skillname`;
        const request = connection.request();
        console.log("skillname:", skillname)
        request.input("skillname", sql.NVarChar, skillname); // Use appropriate SQL type
    
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(
          (row) => new Skill(row.skillid, row.skillname)
        ); // Convert rows to Skill instances
    }

    static async createVolunteerSkills(newVolunteerData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `INSERT INTO VolunteerSkills (skillid, volunteerid) VALUES (@skillid, @volunteerid)`;
    
        const request = connection.request(); // Ensure `request` is created
        request.input("volunteerid", sql.Int, newVolunteerData.volunteerid); // Specify SQL data type
        request.input("skillid", sql.Int, newVolunteerData.skillid); // Specify SQL data type
    
        const result = await request.query(sqlQuery);
        connection.close();
    
        return result;
    }
    

    static async createOppSkills(newOppSkills) {
        const connection = await sql.connect(dbConfig);
        //insert values
        const sqlQuery = `INSERT INTO OpportunitySkills (skillid, opportunityid) SELECT s.skillid, o.opportunityid FROM Skills s, Opportunities o WHERE s.skillname = @skillname AND o.opportunityid = @opportunityid; SELECT SCOPE_IDENTITY() AS id;`;

        const request = connection.request();
        request.input("skillname", newOppSkills.skillid);
        request.input("opportunityid", newOppSkills.opportunityid);


        const result = await request.query(sqlQuery);

        connection.close();

        return result;
    }

    static async updateOppSkills(id, newOppSkillsData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE OpportunitySkills SET skillid = (SELECT skillid FROM Skills WHERE skillname = @skillname) WHERE opportunityid = @opportunityid;`;

        const request = connection.request();
        request.input("id", id);
        request.input("skillname", newOppSkillsData.skillid);
        request.input("opportunityid", newOppSkillsData.opportunityid);

        const result = await request.query(sqlQuery);
    
        connection.close();

        return result;
    }

    static async getOpportunitySkillsById(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM OpportunitySkills WHERE opportunityid = @opportunityid`; //params

        const request = connection.request();
        request.input("opportunityid", id);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new Skill(
                result.recordset[0].id,
                result.recordset[0].skillid,
                result.recordset[0].opportunityid,
            )
            : null; //not found
    }


    }


   






module.exports = Skill;