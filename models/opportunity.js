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
            (row) => new Opportunity(row.opportunityid, row.ngoid, row.title, row.description, row.address, row.region, row.datetime, row.maxvolunteers, row.currentvolunteers)
        ) //convert rows to volunteers
    }

    static async getOpportunityById(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Opportunities WHERE opportunityid = @opportunityid`; //params

        const request = connection.request();
        request.input("opportunityid", id)
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
    /*
    
    

    static async createBook(newBookData) {
        const connection = await sql.connect(dbConfig)

        const sqlQuery = `INSERT INTO Books (title, author) VALUES (@title, @author); SELECT SCOPE_IDENTITY() AS id;`

        const request = connection.request()
        request.input("title", newBookData.title)
        request.input("author", newBookData.author)

        const result = await request.query(sqlQuery)

        connection.close()

        return this.getBookById(result.recordset[0].id)

    }

    static async updateBook(id, newBookData) {
        const connection = await sql.connect(dbConfig)

        const sqlQuery = `UPDATE Books SET title = @title, author = @author WHERE id = @id`

        const request = connection.request()
        request.input("id", id)
        request.input("title", newBookData.title || null)
        request.input("author", newBookData.author || null)

        await request.query(sqlQuery)

        connection.close()

        return this.getBookById(id)
    }

    static async deleteBook(id) {
        const connection = await sql.connect(dbConfig)

        const sqlQuery = `DELETE FROM Books WHERE id = @id`

        const request = connection.request()
        request.input("id", id)

        const result = await request.query(sqlQuery)
        
        connection.close()

        return result.rowsAffected > 0; // Indicate success based on affected rows
    }
        */
}




module.exports = Opportunity;