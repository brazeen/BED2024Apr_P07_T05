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

    //brandon
    static async deleteVolunteer(id) {
        const connection = await sql.connect(dbConfig)

        const sqlQuery = `DELETE FROM Volunteers WHERE volunteerid = @volunteerid`

        const request = connection.request()
        request.input("volunteerid", id)

        const result = await request.query(sqlQuery)

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

//yangyi (create new volunteer)
    static async createVolunteer(newVolunteerData) {
        const connection = await sql.connect(dbConfig)
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const bio = document.getElementById('bio').value;
        const skills = document.getElementById('skills').value;
        const dateofbirth = document.getElementById('Dob').value;
        const profilepicture = document.getElementById('profile-pic').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        const sqlQuery = `INSERT INTO Volunteers (name, email, password, skills, bio, dateofbirth, profilepicture) `

        const request = connection.request()
        request.input("name", newVolunteerData.name)
        request.input("email", newVolunteerData.email)
        request.input("password", newVolunteerData.password)
        request.input("bio", newVolunteerData.bio)
        request.input("dateofbirth", newVolunteerData.dateofbirth)
        request.input("profilepicture", newVolunteerData.profilepicture)

        const result = await request.query(sqlQuery)

        connection.close()

        return this.getBookById(result.recordset[0].id)

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