const sql = require("mssql")
const dbConfig = require("../dbConfig");

class Opportunity {
    constructor(opportunityid, ngoid, title, description, address, region, date, starttime, endtime, maxvolunteers, currentvolunteers) {
        this.opportunityid = opportunityid;
        this.ngoid = ngoid;
        this.title = title;
        this.description = description;
        this.address = address;
        this.region = region;
        this.date = date;
        this.starttime = starttime;
        this.endtime = endtime;
        this.maxvolunteers = maxvolunteers;
        this.currentvolunteers = currentvolunteers;
    }

    static async getAllOpportunities() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Opportunities`; //code to get all opportunities

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new Opportunity(row.opportunityid, row.ngoid, row.title, row.description, row.address, row.region, row.date, row.starttime, row.endtime, row.maxvolunteers, row.currentvolunteers)
        ) //convert rows to volunteers
    }

    static async createOpportunity(newOpp) {
        const connection = await sql.connect(dbConfig);
        //insert values
        const sqlQuery = `INSERT INTO Opportunities (ngoid, title, description,address,region,date,starttime,endtime,maxvolunteers,currentVolunteers) VALUES (1, @title, @description,@address,@region,@date,@starttime,@endtime,@maxvolunteers,0);`;

        const request = connection.request();
        request.input("ngoid", newOpp.ngoid);
        request.input("title", newOpp.title);
        request.input("description", newOpp.description);
        request.input("address", newOpp.address);
        request.input("region", newOpp.region);
        request.input("date", newOpp.date);
        request.input("starttime", newOpp.starttime);
        request.input("endtime", newOpp.endtime);
        request.input("maxvolunteers", newOpp.maxvolunteers);
        


        const result = await request.query(sqlQuery);

        connection.close();

        return this.getAllOpportunities();

    }


    static async getOpportunityById(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Opportunities WHERE opportunityid = @opportunityid`; //params

        const request = connection.request();
        request.input("opportunityid", id);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new Opportunity(
                result.recordset[0].opportunityid,
                result.recordset[0].ngoid,
                result.recordset[0].title,
                result.recordset[0].description,
                result.recordset[0].address,
                result.recordset[0].region,
                result.recordset[0].date,
                result.recordset[0].starttime,
                result.recordset[0].endtime,
                result.recordset[0].maxvolunteers,
                result.recordset[0].currentvolunteers,
            )
            : null; //not found
    }

    static async getOpportunitySkills(id) {
        const connection = await sql.connect(dbConfig);
        try {
            const query = `
          SELECT s.skillname
          FROM Skills s
          INNER JOIN OpportunitySkills os ON os.skillid = s.skillid
          WHERE os.opportunityid = @opportunityid;
          `;
            const request = connection.request();
            request.input("opportunityid", id);
            const result = await request.query(query);

            return result.recordset.map(row => row.skillname)
        } catch (error) {
            console.log(error);
            throw new Error("Error fetching opportunity's skill");

        } finally {
            await connection.close();
        }
    }
    
}




module.exports = Opportunity;