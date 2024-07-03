const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("../models/user")

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers()
        res.json(users)
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error retrieving users")
    }
}

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.getUserById(userId)
    if (!user) {
      return res.status(404).send("User not found")
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user");
  }
};

const getUserByUsername = async (req, res) => {
    const username = req.params.username;
    try {
      const user = await User.getUserByUsername(username)
      if (!user) {
        return res.status(404).send("User not found")
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving user");
    }
};

const createUser = async (req, res) => {
  const newUser = req.body;
  try {
      const createdUser = await User.createUser(newUser)
      res.status(201).json(createdUser)
  }
  catch(error) {
      res.status(500).send("Error creating user")
  }
}

async function registerUser(req, res) {
  const { username, password, role } = req.body;

  try {
    // Validate user data
    if (password.length < 5) {
      return res.status(400).json({ message: "Password too short" });
    }
    // Check for existing username
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {username: username, passwordHash: hashedPassword, role: role}
    await createUser(newUser);
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Validate user credentials
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      id: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "3600s" }); // Expires in 1 hour

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = {
    getAllUsers,
    getUserById,
    getUserByUsername,
    createUser,
    registerUser,
    login
}