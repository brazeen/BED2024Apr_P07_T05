const Chat = require("../models/chat");

async function getVolunteerMessages(req, res) {
    const volunteerId = parseInt(req.params.id);
    
    try {
        const messages = await Chat.getVolunteerMessages(volunteerId);
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving messages");
    }
}

async function getVolunteerChats(req, res) {
    const volunteerId = parseInt(req.params.id);
    try {
        const chats = await Chat.getVolunteerChats(volunteerId);
        res.json({ chats });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving chats");
    }
}

module.exports = {
    getVolunteerChats,
    getVolunteerMessages
};
