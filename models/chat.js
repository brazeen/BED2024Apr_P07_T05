const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Chat {
    constructor(messageid, volunteerid, ngoid, content, timestamp, senderName) {
        this.volunteerid = volunteerid;
        this.messageid = messageid;
        this.ngoid = ngoid;
        this.content = content;
        this.timestamp = timestamp;
        this.senderName = senderName; 
    }

    static async getVolunteerMessages(id) {
    try {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
        SELECT m.messageid, m.volunteerid, m.ngoid, m.content, m.timestamp, v.name AS senderName
        FROM Messages m
        INNER JOIN Volunteers v ON m.volunteerid = v.volunteerid
        WHERE m.volunteerid = @id
        ORDER BY m.timestamp;  -- Ensure messages are ordered by timestamp
        `;
        const request = connection.request();
        request.input("id", sql.Int, id);
        const result = await request.query(sqlQuery);
        connection.close();

        // Map each record to a Chat instance
        return result.recordset.map(record => 
            new Chat(record.messageid, record.volunteerid, record.ngoid, record.content, record.timestamp, record.senderName)
        );
    } catch (err) {
        console.error('Error fetching messages:', err);
        throw err;
    }
}

    
    static async getVolunteerChats(id) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
                SELECT DISTINCT n.name, m.ngoid
                FROM NGOs n
                INNER JOIN Messages m ON m.ngoid = n.ngoid
                WHERE m.volunteerid = @id
            `;
            const request = connection.request();
            request.input("id", sql.Int, id);
            const result = await request.query(sqlQuery);
            connection.close();
            return result.recordset.map(record => ({
                ngoName: record.name,
                ngoid: record.ngoid
            }));
        } catch (err) {
            console.error('Error fetching chats:', err);
            throw err;
        }
    }
    
}

module.exports = Chat;
