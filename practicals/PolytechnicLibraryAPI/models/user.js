const sql = require("mssql")
const dbConfig = require("../dbConfig");

class User {
    constructor(user_id, username, passwordHash, role) {
        this.user_id = user_id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    static async getUserByUsername(username) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Users WHERE username = @username`; //params

        const request = connection.request();
        request.input("username", username)
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0] ?
            new User(result.recordset[0].user_id, result.recordset[0].username, result.recordset[0].passwordHash, result.recordset[0].role)
         : null //convert rows to NGOs
        //possible null
    }

    static async createUser(newUserData) {
        const connection = await sql.connect(dbConfig)

        const sqlQuery = `INSERT INTO Users (username, passwordHash, role) VALUES (@username, @passwordHash, @role); SELECT SCOPE_IDENTITY() AS user_id;`

        const request = connection.request()
        request.input("username", newUserData.username)
        request.input("passwordHash", newUserData.passwordHash)
        request.input("role", newUserData.role)


        const result = await request.query(sqlQuery)

        connection.close()

        return this.getUserById(result.recordset[0].id)

    }
}

module.exports = User;