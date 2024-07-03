const sql = require("mssql")
const dbConfig = require("../dbConfig");

class Book {
    constructor(book_id, title, author, availability) {
        this.book_id = book_id;
        this.title = title;
        this.author = author;
        this.availability = availability;
    }

    static async getAllBooks() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Books`; //code to get all volunteers

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new Book(row.book_id, row.title, row.author, row.availability)
        ) //convert rows
    }

    static async getBookById(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Books WHERE book_id = @book_id`; //params

        const request = connection.request();
        request.input("book_id", id)
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new Book(result.recordset[0].id,
                result.recordset[0].title,
                result.recordset[0].author,
                result.recordset[0].availability
            )
            : null; //book not found
    }

    static async updateBookAvailability(id, availability) {
        const connection = await sql.connect(dbConfig)

        const sqlQuery = `UPDATE Books SET availability = @availability WHERE book_id = @book_id`

        const request = connection.request()
        request.input("book_id", id)
        request.input("availability", availability)
        

        await request.query(sqlQuery)

        connection.close()

        return this.getBookById(id)
    }
}

module.exports = Book;