const sql = require("mssql")
const dbConfig = require("../dbConfig");

class Application {
    constructor(applicationid, volunteerid, opportunityid, status) {
        this.applicationid = applicationid;
        this.volunteerid = volunteerid;
        this.opportunityid = opportunityid;
        this.status = status;
    }

    static async getApplicationById(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Applications WHERE applicationid = @applicationid`; //params

        const request = connection.request();
        request.input("applicationid", id)
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0] ?
            new Application(result.recordset[0].applicationid, result.recordset[0].volunteerid, result.recordset[0].opportunityid, result.recordset[0].status)
        : null; //convert rows
    }

    static async getApplicationByVolunteerId(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Applications WHERE volunteerid = @volunteerid`; //params

        const request = connection.request();
        request.input("volunteerid", id)
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new Application(row.applicationid, row.volunteerid, row.opportunityid, row.status)
        ) //convert rows
    }

    static async getApplicationByVolunteerAndOpportunityId(volunteerid, opportunityid) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Applications WHERE volunteerid = @volunteerid AND opportunityid = @opportunityid`; //params

        const request = connection.request();
        request.input("volunteerid", volunteerid)
        request.input("opportunityid", opportunityid)
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0] ?
            new Application(result.recordset[0].applicationid, result.recordset[0].volunteerid, result.recordset[0].opportunityid, result.recordset[0].status)
        : null; //convert rows
    }

    static async getApplicationsByOpportunityandStatus(opportunityid, status) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Applications WHERE status = @status AND opportunityid = @opportunityid`; //params

        const request = connection.request();
        request.input("status", status)
        request.input("opportunityid", opportunityid)
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new Application(row.applicationid, row.volunteerid, row.opportunityid, row.status)
        ) //convert rows
    }

    static async createApplication(newApplicationData) {
        const connection = await sql.connect(dbConfig)

        const sqlQuery = `INSERT INTO Applications (volunteerid, opportunityid, status) VALUES (@volunteerid, @opportunityid, @status); SELECT SCOPE_IDENTITY() AS applicationid;`

        const request = connection.request()
        request.input("volunteerid", newApplicationData.volunteerid)
        request.input("opportunityid", newApplicationData.opportunityid)
        request.input("status", newApplicationData.status)

        const result = await request.query(sqlQuery)

        connection.close()

        console.log(result.recordset)       
        return this.getApplicationById(result.recordset[0].applicationid);

    }

    static async updateApplicationStatus(volunteerid, opportunityid, status) {
        const connection = await sql.connect(dbConfig)

        const sqlQuery = `UPDATE Applications SET status = @status WHERE volunteerid = @volunteerid AND opportunityid = @opportunityid`

        const request = connection.request()
        request.input("volunteerid", volunteerid)
        request.input("opportunityid", opportunityid)
        request.input("status", status)

        await request.query(sqlQuery)

        connection.close()

        return this.getApplicationByVolunteerAndOpportunityId(volunteerid, opportunityid); 
    }

    static async deleteApplication(volunteerid, opportunityid) {
        const connection = await sql.connect(dbConfig)

        const sqlQuery = `DELETE FROM Applications WHERE volunteerid = @volunteerid AND opportunityid = @opportunityid`

        const request = connection.request()
        request.input("volunteerid", volunteerid)
        request.input("opportunityid", opportunityid)

        const result = await request.query(sqlQuery)
        
        connection.close()

        return result.rowsAffected > 0; // Indicate success based on affected rows
    }
/*
    static async getAllVolunteers() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Volunteers`; //code to get all volunteers

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new Volunteer(row.id, row.name, row.email, row.password, row.bio, row.dateofbirth, row.profilepicture)
        ) //convert rows to volunteers
    }

    
    

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

    
        */
}




module.exports = Application;