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

    //brandon
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

    static async getVolunteerById(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Volunteers WHERE volunteerid = @volunteerid`; //params

        const request = connection.request();
        request.input("volunteerid", id)
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new Volunteer(result.recordset[0].volunteerid, result.recordset[0].name, result.recordset[0].email, result.recordset[0].password, result.recordset[0].bio, result.recordset[0].dateofbirth, result.recordset[0].profilepicture)
            : null; // not found
    }

    static async getVolunteerByName(username) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Volunteers WHERE name = @name`; //params

        const request = connection.request();
        request.input("name", username)
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new Volunteer(result.recordset[0].volunteerid, result.recordset[0].name, result.recordset[0].email, result.recordset[0].password, result.recordset[0].bio, result.recordset[0].dateofbirth, result.recordset[0].profilepicture)
            : null; // not found
    }

    static async deleteVolunteer(id) {
        const connection = await sql.connect(dbConfig)
        const sqlQuery = `DELETE FROM Volunteers WHERE volunteerid = @volunteerid`
        const request = connection.request()
        request.input("volunteerid", id)
        const result = await request.query(sqlQuery);
        connection.close()

        return result.rowsAffected > 0; // Indicate success based on affected rows
    }

    //brandon
    //this method gets all the volunteer's skills
    static async getVolunteerSkills(id) {
        const connection = await sql.connect(dbConfig);
        try {
            const query = `
          SELECT s.skillname
          FROM Skills s
          INNER JOIN VolunteerSkills vs ON vs.skillid = s.skillid
          WHERE vs.volunteerid = @volunteerid;
          `;
            const request = connection.request();
            request.input("volunteerid", id)
            const result = await request.query(query);

            return result.recordset.map(row => row.skillname)
        } catch (error) {
            console.log(error)
            throw new Error("Error fetching volunteer's skill");

        } finally {
            await connection.close();
        }
    }

    static async createVolunteer(newVolunteerData) {
        const connection = await sql.connect(dbConfig)

        const sqlQuery = `INSERT INTO volunteers (name, email, password, bio, dateofbirth, profilepicture) VALUES (@name, @email, @passwordHash, @bio, @dateofbirth, @profilepicture); SELECT SCOPE_IDENTITY() AS volunteerid;`

        const request = connection.request()
        request.input("name", newVolunteerData.name)
        request.input("email", newVolunteerData.email)
        request.input("passwordHash", newVolunteerData.password)
        request.input("bio", newVolunteerData.bio)
        request.input("dateofbirth", newVolunteerData.dateofbirth)
        request.input("profilepicture", newVolunteerData.profilepicture)


        const result = await request.query(sqlQuery)

        connection.close()

        return this.getVolunteerByName(result.recordset[0].name)

    }


    
    /*
    

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




module.exports = Volunteer;