const sql = require("mssql")
const dbConfig = require("../dbConfig");

class Skill {
    constructor(skillid, skillname) {
        this.skillid = skillid;
        this.skillname = skillname;
    }

    static async getAllSkills() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Skills`; //code to get all volunteers

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new Skill(row.skillid, row.skillname)
        ) //convert rows to volunteers
    }

    static async createOppSkills(newOppSkills) {
        const connection = await sql.connect(dbConfig);
        //insert values
        const sqlQuery = `INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (SELECT skillid FROM Skills, SELECT opportunityid FROM Opportunities); SELECT SCOPE_IDENTITY() AS id;`;

        const request = connection.request();
        request.input("skillid", newOppSkills.skillid);
        request.input("opportunityid", newOppSkills.opportunityid);
    }


   
}




module.exports = Skill;