const admin = require("../models/admin");
const { user } = require("../dbConfig")

async function getAdmin(req, res) {
  try {
    const users = await admin.getAdmin();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching admin." });
  }
}

async function searchAdmin(req, res) {
    const searchTerm = req.query.searchTerm; 
  
    try {    
      const users = await admin.searchAdmin(searchTerm);
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error searching admin" });
    }
  }
const getAllAdmin = async (req, res) => {
    try {
        const user = await admin.getAllAdmin();
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving admin");
    }
};

const getAdminById = async (req, res) => {
    const AdminId = parseInt(req.params.id);
    try {
        const book = await admin.getAdminById(AdminId);
        if(!book) {
            return res.status(404).send("Admin not found");
        }
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving admin");
    }
};

const createAdmin = async (req, res) => {
    const newAdmin = req.body;
    try {
      const createdAdmin = await admin.createAdmin(newAdmin);
      res.status(201).json(createdAdmin);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating admin");
    }
};

const updateAdmin = async (req, res) => {
    const AdminId = parseInt(req.params.id);
    const newAdminData = req.body;
  
    try {
      const updatedAdmin = await admin.updateAdmin(AdminId, newAdminData);
      if (!updatedAdmin) {
        return res.status(404).send("Admin not found");
      }
      res.json(updatedAdmin);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating admin");
    }
  };
  
  const deleteAdmin = async (req, res) => {
    const AdminId = parseInt(req.params.id);
  
    try {
      const success = await admin.deleteAdmin(AdminId);
      if (!success) {
        return res.status(404).send("Admin not found");
      }
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting admin");
    }
};
  
  module.exports = {
    getAllAdmin,
    createAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    searchAdmin
  };
