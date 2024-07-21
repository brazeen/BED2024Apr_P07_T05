const sql = require("mssql")
const dbConfig = require("../dbConfig");

class Opportunity {
    constructor(opportunityid, ngoid, title, description, address, region, date, starttime, endtime, age, maxvolunteers, currentvolunteers) {
        this.opportunityid = opportunityid;
        this.ngoid = ngoid;
        this.title = title;
        this.description = description;
        this.address = address;
        this.region = region;
        this.date = date;
        this.starttime = starttime;
        this.endtime = endtime;
        this.age = age;
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
            (row) => new Opportunity(row.opportunityid, row.ngoid, row.title, row.description, row.address, row.region, row.date, row.starttime, row.endtime, row.age, row.maxvolunteers, row.currentvolunteers)
        ) //convert rows to volunteers
    }

    static async createOpportunity(newOpp) {
        const connection = await sql.connect(dbConfig);
        //insert values
        const sqlQuery = `INSERT INTO Opportunities (ngoid, title, description,address,region,date,starttime,endtime,age,maxvolunteers,currentVolunteers) VALUES (1, @title, @description,@address,@region,@date,@starttime,@endtime,@age,@maxvolunteers,0);`;

        const request = connection.request();
        request.input("ngoid", newOpp.ngoid);
        request.input("title", newOpp.title);
        request.input("description", newOpp.description);
        request.input("address", newOpp.address);
        request.input("region", newOpp.region);
        request.input("date", newOpp.date);
        request.input("starttime", newOpp.starttime);
        request.input("endtime", newOpp.endtime);
        request.input("age", newOpp.age);
        request.input("maxvolunteers", newOpp.maxvolunteers);
        


        const result = await request.query(sqlQuery);

        connection.close();

        return this.getAllOpportunities();

    }

    static async deleteOpportunityById(id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `DELETE FROM Opportunities WHERE opportunityid = @opportunityid`; // params
    
        const request = connection.request();
        request.input("opportunityid", id);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.rowsAffected > 0; // Indicate success
    }

    static async updateOpportunity(id, newOppData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `UPDATE Opportunities SET ngoid = 1, title = @title, description = @description, address = @address, region = @region, date = @date, starttime = @starttime, endtime = @endtime, age = @age, maxvolunteers = @maxvolunteers, currentVolunteers = 0 WHERE opportunityid = @opportunityid`; // Parameterized query
    
        const request = connection.request();
        request.input("opportunityid", id);
        request.input("title", newOppData.title || null); // Handle optional fields
        request.input("description", newOppData.description || null);
        request.input("address", newOppData.address || null);
        request.input("region", newOppData.region || null);
        request.input("date", newOppData.date || null);
        request.input("starttime", newOppData.starttime || null);
        request.input("endtime", newOppData.endtime || null);
        request.input("age", newOppData.age || null);
        request.input("maxvolunteers", newOppData.maxvolunteers || null);
    
        await request.query(sqlQuery);
    
        connection.close();
    
        return this.getOpportunityById(id); // return the updated opportunity data
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
                result.recordset[0].age,
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

    static async incrementOpportunityCurrentVolunteers(id) {
        const connection = await sql.connect(dbConfig);
        try {
            const query = `UPDATE Opportunities SET currentvolunteers = currentvolunteers + 1 WHERE opportunityid = @opportunityid; SELECT SCOPE_IDENTITY() AS opportunityid;`
            const request = connection.request();
            request.input("opportunityid", id);
            const result = await request.query(query);

            return this.getOpportunityById(result.recordset[0].opportunityid)
        } catch (error) {
            console.log(error);
            throw new Error("Error updating opportunity");

        } finally {
            await connection.close();
        }
    }
    
    static async searchOpportunity(searchTerm) {
        const connection = await sql.connect(dbConfig);
    
        try {
          const query = `
            SELECT o.opportunityid, o.ngoid, o.title, o.description, o.address, o.region, o.date, o.starttime, o.endtime, o.age, o.maxvolunteers, o.currentvolunteers, s.skillname FROM Opportunities o
            INNER JOIN OpportunitySkills os ON os.opportunityid = o.opportunityid
            INNER JOIN Skills s ON s.skillid = os.skillid
            WHERE region LIKE '%${searchTerm}%'
            OR date LIKE '%${searchTerm}%'
            OR skillid LIKE '%${searchTerm}%'
          `;
    
          const result = await connection.request().input('searchTerm', sql.NVarChar, '%' + searchTerm + '%').query(query);
          return result.recordset;
        } catch (error) {
          throw new Error("Error searching Opportunities");
        } finally {
          await connection.close(); // Close connection even on errors
        }
      }

}




module.exports = Opportunity;