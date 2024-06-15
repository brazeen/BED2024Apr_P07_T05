const sql = require("mssql")
const dbConfig = require("../dbConfig");

class NGO {
    constructor(ngoid, name, email, password, logo, description, contactperson, contactnumber, address, status) {
        this.ngoid = ngoid;
        this.name = name;
        this.email = email;
        this.password = password;
        this.logo = logo;
        this.description = description;
        this.contactperson = contactperson;
        this.contactnumber = contactnumber;
        this.address = address;
        this.status = status;
    }

    static async getAllNGOs() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM NGOs`; //code to get all volunteers

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new NGO(row.ngoid, row.name, row.email, row.password, row.logo, row.description, row.contactperson, row.contactnumber, row.address, row.status)
        ) //convert rows to volunteers
    }

    static async deleteNGO(id) {
        const connection = await sql.connect(dbConfig)

        const sqlQuery = `DELETE FROM NGOs WHERE ngoid = @ngoid`

        const request = connection.request()
        request.input("ngoid", id)

        const result = await request.query(sqlQuery)
        
        connection.close()

        return result.rowsAffected > 0; // Indicate success based on affected rows
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

    
        */
}




module.exports = NGO;