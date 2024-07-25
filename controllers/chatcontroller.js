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

async function getNgoMessages(req, res) {
    const ngoid = parseInt(req.params.id);
    
    try {
        const messages = await Chat.getNgoMessages(ngoid);
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving messages");
    }
}

async function getNgoChats(req, res) {
    const ngoid = parseInt(req.params.id);
    try {
        const chats = await Chat.getVolunteerChats(ngoid);
        res.json({ chats });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving chats");
    }
}

async function createMessage(req, res) {
    const newMessage = req.body;
    console.log("new message:", newMessage)
    try {
        const createdMessage = await Chat.createMessage(newMessage)
        res.status(201).json(createdMessage)
    }
    catch(error) {
        res.status(500).send("Error creating message")
    }
  }
module.exports = {
    getVolunteerChats,
    getVolunteerMessages,
    getNgoChats,
    getNgoMessages,
    createMessage
};
