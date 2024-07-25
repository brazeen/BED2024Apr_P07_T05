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


    /*
    static async getVolunteerById(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Books WHERE id = @id`; //params

        const request = connection.request();
        request.input("id", id)
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new Book(result.recordset[0].id,
                result.recordset[0].title,
                result.recordset[0].author
            )
            : null; //book not found
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




module.exports = Skill;