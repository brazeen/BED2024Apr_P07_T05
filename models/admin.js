const sql = require("mssql")
const dbConfig = require("../dbConfig");

class Admin {
    constructor(adminid, adminname, adminpasswordHash) {
        this.adminid = adminid;
        this.adminname = adminname;
        this.adminpasswordHash = adminpasswordHash;
    }

    static async getAdminByUsername(name) {
        try {
            const connection = await sql.connect(dbConfig);

            const sqlQuery = `SELECT * FROM Admins WHERE adminname = @adminname`; //params

            const request = connection.request();
            request.input("adminname", name)
            const result = await request.query(sqlQuery);

            connection.close();

            return result.recordset[0]
                ? new Admin(result.recordset[0].adminid,
                    result.recordset[0].adminname,
                    result.recordset[0].adminpasswordHash
                )
                : null; // not found
        }
        catch(error){
            console.error(error)
            throw new Error("Database error")
        }
        
    }
    

}




module.exports = Admin;