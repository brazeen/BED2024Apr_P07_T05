const sql = require("mssql");
const dbConfig = require("../dbConfig");
require("dotenv").config()

/*const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Make sure to set your OpenAI API key in your environment variables
});

const openai = new OpenAIApi(configuration);

(async () => {
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Hello, how can you assist me today?" }
            ],
            max_tokens: 100,
            n: 1,
            stop: null,
            temperature: 0.7,
        });
        
        console.log(response.data.choices[0].message.content);
    } catch (error) {
        console.error("Error creating chat completion:", error);
    }
})();*/


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
        SELECT m.messageid, m.volunteerid, m.ngoid, m.content, m.timestamp, m.sender AS senderName
        FROM Messages m
        INNER JOIN Volunteers v ON m.volunteerid = v.volunteerid
        INNER JOIN ngos n ON m.ngoid = n.ngoid
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
    static async getNgoMessages(id) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
            SELECT m.messageid, m.volunteerid, m.ngoid, m.content, m.timestamp, m.sender AS senderName
            FROM Messages m
            INNER JOIN NGOs n ON m.ngoid = n.ngoid
            INNER JOIN Volunteers v ON m.volunteerid = v.volunteerid
            WHERE m.ngoid = @id
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
                ngoid: record.ngoid,
                senderName: record.senderName
            }));
        } catch (err) {
            console.error('Error fetching chats:', err);
            throw err;
        }
    }

    static async getNgoChats(id) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
                SELECT DISTINCT v.name, m.volunteerid
                FROM Volunteers v
                INNER JOIN Messages m ON m.volunteerid = v.volunteerid
                WHERE m.ngoid = @id 
            `;
            const request = connection.request();
            request.input("id", sql.Int, id);
            const result = await request.query(sqlQuery);
            connection.close();
            return result.recordset.map(record => ({
                volunteerName: record.name, 
                volunteerid: record.volunteerid
            }));
        } catch (err) {
            console.error('Error fetching chats:', err);
            throw err;
        }
    }

    static async createMessage(newMessage) {
        const connection = await sql.connect(dbConfig);
        //insert values
        const sqlQuery = `INSERT INTO Messages (volunteerid, ngoid, content, timestamp, sender) VALUES (@volunteerid, @ngoid, @content, @timestamp, @senderName )`;

        const request = connection.request();
        request.input("volunteerid", newMessage.volunteerid);
        request.input("ngoid", newMessage.ngoid);
        request.input("content", newMessage.content);
        request.input("timestamp", newMessage.timestamp);
        request.input("senderName", newMessage.senderName)
        
        const result = await request.query(sqlQuery);

        connection.close();

        return this.getVolunteerMessages();

    }

    //function to create a new chat
   /* static async createChat(newChat) {
        const connection = await sql.connect(dbConfig);
        //insert values
        const sqlQuery = `INSERT INTO Messages (volunteerid, ngoid, content, timestamp, sender) VALUES (@volunteerid, @ngoid, @content, @timestamp, @senderName )`;

        const request = connection.request();
        request.input("volunteerid", newChat.volunteerid);
        request.input("ngoid", newChat.ngoid);
        request.input("content", newChat.content);
        request.input("timestamp", newChat.timestamp);
        request.input("senderName", newChat.senderName)
        
        const result = await request.query(sqlQuery);

        connection.close();

        return this.getVolunteerMessages();
    }*/
    
}

module.exports = Chat;
