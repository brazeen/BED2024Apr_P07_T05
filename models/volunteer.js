const sql = require("mssql")
const dbConfig = require("../dbConfig");

class Volunteer {
    constructor(volunteerid, name, email, password, bio, dateofbirth, profilepicture) {
        this.volunteerid = volunteerid;
        this.name = name;
        this.email = email;
        this.password = password;
        this.bio = bio;
        this.dateofbirth = dateofbirth;
        this.profilepicture = profilepicture;
    }

    static async getAllVolunteers() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Volunteers`; //code to get all volunteers

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new Volunteer(row.volunteerid, row.name, row.email, row.password, row.bio, row.dateofbirth, row.profilepicture)
        ) //convert rows to volunteers
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




module.exports = Volunteer;