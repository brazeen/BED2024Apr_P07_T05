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
        const sqlQuery = `INSERT INTO OpportunitySkills (skillid, opportunityid) SELECT s.skillid, o.opportunityid FROM Skills s, Opportunities o WHERE s.skillname = @skillname AND o.opportunityid = @opportunityid; SELECT SCOPE_IDENTITY() AS id;`;

        const request = connection.request();
        request.input("skillname", newOppSkills.skillid);
        request.input("opportunityid", newOppSkills.opportunityid);

        const result = await request.query(sqlQuery);

        connection.close();

        return result;
    }

}




module.exports = Skill;