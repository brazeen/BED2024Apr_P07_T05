const User = require("../models/user")

const getAllUsers = async (req, res) => {
    try {
        const books = await User.getAllUsers()
        res.json(users)
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error retrieving users")
    }
}

const getUserById = async (req, res) => {
    const userid = req.params.id;
    try {
      const book = await User.getUserById(userid)
      if (!user) {
        return res.status(404).send("User not found")
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving user");
    }
};






module.exports = {
    getAllUsers,
    getUserById,
}