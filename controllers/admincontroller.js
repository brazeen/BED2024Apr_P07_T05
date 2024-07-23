const Admin = require("../models/admin");
const { user } = require("../dbConfig")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
require("dotenv").config()

const getAdminByUsername = async (req, res) => {
    const Adminname = req.params.name;
    try {
        const admin = await Admin.getAdminByUsername(Adminname);
        if(!admin) {
            return res.status(404).send("Admin not found");
        }
        res.json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving admin");
    }
};

async function loginAdmin(req, res) {
  const { username, password } = req.body;

  try {
    // Validate user credentials
    const admin = await Admin.getAdminByUsername(username);
    if (!admin) {
      return res.status(401).json({ message: "Invalid username" });
    }
    // Compare password with hash
    const isMatch = await bcrypt.compare(password, admin.adminpasswordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const payload = {
      id: admin.adminid,
      role: "admin",
    };  
    const token = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: "3600s" }); // Expires in 1 hour
    return res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin.adminid,
        role: "admin"
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

  module.exports = {
    getAdminByUsername,
    loginAdmin
  };
