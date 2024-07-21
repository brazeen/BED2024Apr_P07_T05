const sql = require("mssql")
const dbConfig = require("../dbConfig");

class NGO {
    constructor(ngoid, name, email, passwordHash, logo, description, contactperson, contactnumber, address, status) {
        this.ngoid = ngoid;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
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
            (row) => new NGO(row.ngoid, row.name, row.email, row.passwordHash, row.logo, row.description, row.contactperson, row.contactnumber, row.address, row.status)
        ) //convert rows to volunteers
    }

    static async getNGOsByStatus(status) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM NGOs WHERE status = @status`; //params

        const request = connection.request();
        request.input("status", status)
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new NGO(row.ngoid, row.name, row.email, row.passwordHash, row.logo, row.description, row.contactperson, row.contactnumber, row.address, row.status)
        ) //convert rows to NGOs
        //possible null
    }

    static async getNGOById(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM NGOs WHERE ngoid = @ngoid`; //params

        const request = connection.request();
        request.input("ngoid", id)
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0] ?
            new NGO(result.recordset[0].ngoid, result.recordset[0].name, result.recordset[0].email, result.recordset[0].passwordHash, result.recordset[0].logo, result.recordset[0].description, result.recordset[0].contactperson, result.recordset[0].contactnumber, result.recordset[0].address, result.recordset[0].status)
         : null //convert rows to NGOs
        //possible null
    }

    static async updateNGO(id, newNGOData) {
        const connection = await sql.connect(dbConfig)

        const sqlQuery = `UPDATE NGOs SET name = @name, email = @email, passwordHash = @passwordHash, logo = @logo, description = @description, contactperson = @contactperson, contactnumber = @contactnumber, address = @address, status = @status WHERE ngoid = @ngoid`

        const request = connection.request()
        request.input("ngoid", id)
        request.input("name", newNGOData.name || null)
        request.input("email", newNGOData.email || null)
        request.input("passwordHash", newNGOData.passwordHash || null)
        request.input("logo", newNGOData.logo || null)
        request.input("description", newNGOData.description || null)
        request.input("contactperson", newNGOData.contactperson || null)
        request.input("contactnumber", newNGOData.contactnumber || null)
        request.input("address", newNGOData.address || null)
        request.input("status", newNGOData.status || null)

        await request.query(sqlQuery)

        connection.close()

        return this.getNGOById(id)
    }

    static async updateNGOStatus(id, status) {
        const connection = await sql.connect(dbConfig)

        const sqlQuery = `UPDATE NGOs SET status = @status WHERE ngoid = @ngoid`

        const request = connection.request()
        request.input("ngoid", id)
        request.input("status", status || null)

        await request.query(sqlQuery)

        connection.close()

        return this.getNGOById(id)
    }
    
    static async updateNGOLogo(id, imagepath) {
        const connection = await sql.connect(dbConfig)

        const sqlQuery = `UPDATE NGOs SET logo = @logo WHERE ngoid = @ngoid;`

        const request = connection.request()
        request.input("ngoid", id)
        request.input("logo", imagepath)

        await request.query(sqlQuery)

        connection.close()

        return this.getNGOById(id)
    }

    static async updateNGOPassword(id, hash) {
        const connection = await sql.connect(dbConfig)

        const sqlQuery = `UPDATE NGOs SET passwordHash = @passwordHash WHERE ngoid = @ngoid;`

        const request = connection.request()
        request.input("ngoid", id)
        request.input("passwordHash", hash)

        await request.query(sqlQuery)

        connection.close()

        return this.getNGOById(id)
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

    static async searchAcceptedNGOs(searchTerm) {
        const connection = await sql.connect(dbConfig)
        
        const sqlQuery = `SELECT * FROM NGOs WHERE name LIKE '%${searchTerm}%' AND status = 'A'`
    
        const request = connection.request()
        
        const result = await request.query(sqlQuery);
    
        connection.close()
    
        return result.recordset.map(
            (row) => new NGO(row.ngoid, row.name, row.email, row.passwordHash, row.logo, row.description, row.contactperson, row.contactnumber, row.address, row.status)
        ) //convert rows to NGOs
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

    
        */
}




module.exports = NGO;