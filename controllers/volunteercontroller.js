const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Volunteer = require("../models/volunteer");

const getMaxVolunteerId = async (req, res) => {
  try {
    const maxId = await Volunteer.getMaxVolunteerId();
    res.json({ maxVolunteerId: maxId });
} catch (error) {
    console.error('Error fetching max volunteer id:', error);
    res.status(500).json({ message: 'Internal server error' });
}
}
//brandon
const getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.getAllVolunteers()
        res.json(volunteers)
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error retrieving volunteers")
    }
}

const getVolunteerById = async (req, res) => {
  const volunteerid = req.params.id;
  try {
    const volunteer = await Volunteer.getVolunteerById(volunteerid);
    if (!volunteer) {
      return res.status(404).send("Volunteer not found")
    } 

    res.json(volunteer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Volunteer");
  }
};


//brandon
const deleteVolunteer = async (req, res) => {
    const volunteerId = req.params.id;
    try {
        const volunteer = await Volunteer.deleteVolunteer(volunteerId);
        if (!volunteer) {
          return res.status(404).send("Volunteer not found");
        }
        res.status(204).send()
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error deleting volunteer")
    }
}

async function getVolunteerSkills(req, res) {
    const volId = parseInt(req.params.id);
    try {
      const skills = await Volunteer.getVolunteerSkills(volId);
      res.json(skills);
    } catch (error) {
      console.error(error); 
      res.status(500).json({ message: "Error fetching volunteer's skill" });
    }
}

const createVolunteer = async (req, res) => {
  const newVolunteer = req.body;
  try {
      const createdVolunteer = await Volunteer.createVolunteer(newVolunteer)
      res.status(201).json(createdVolunteer)
  }
  catch(error) {
      res.status(500).send("Error creating volunteer")
  }
}


const updateVolunteer = async (req, res) => {
  const volId = req.params.id;
  const newVolunteerData = req.body;
  try {
      const volunteer = await Volunteer.updateVolunteer(volId, newVolunteerData);
      
      if (!volunteer) {
        return res.status(404).send("Volunteer not found");
      }
      res.status(200) //send a OK status code so that the website knows that the thing was ok
      
  }
  catch(error) {
      console.error(error)
      res.status(500).send("Error updating volunteer")
  }
}

const updateVolunteerProfilePicture = async (req, res) => {
  const volId = req.params.id;
  const newPhoto = req.file;
  const imagepath = newPhoto.path.slice(6);
  try {
      const volunteer = await Volunteer.updateVolunteerProfilePicture(volId, imagepath);
      
      if (!volunteer) {
        return res.status(404).send("Volunteer not found");
      }
      res.status(201) //send a OK status code
      
  }
  catch(error) {
      console.error(error)
      res.status(500).send("Error updating volunteer profile picture")
  }
}

const updateVolunteerPassword = async (req, res) => {
  const volId = req.params.id;
  const hash = req.params.hash;
  try {
      const volunteer = await Volunteer.updateVolunteerPassword(volId, hash);
      
      if (!volunteer) {
        return res.status(404).send("Volunteer not found");
      }
      res.status(200).json(volunteer) //send a OK status code
      
  }
  catch(error) {
      console.error(error)
      res.status(500).send("Error updating volunteer password")
  }
}

async function registerVolunteer(req, res) {
  const { name, email, password, bio, skills, dateofbirth } = req.body;
  try {
    // Validate user data
    if (String(password).length < 5) {
      return res.status(400).json({ message: "Password too short" });
    }
    //check for existing email
    const existingVolunteerByEmail = await Volunteer.getVolunteerByEmail(email);
    if (existingVolunteerByEmail) {
        return res.status(400).json({ message: "Email already exists" });
    }
    console.log(req.body)
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    const newVolunteer = {name: name, email: email, passwordHash: hashedPassword, bio: bio, skills: skills, dateofbirth: dateofbirth }
    const createdVolunteer = await Volunteer.createVolunteer(newVolunteer);
    return res.status(201).json({ message: "Volunteer created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function loginVolunteer(req, res) {
  const { email, password } = req.body;

  try {
    // Validate user credentials
    const volunteer = await Volunteer.getVolunteerByEmail(email);
    if (!volunteer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Compare password with hash
    const isMatch = await bcrypt.compare(password, volunteer.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      id: volunteer.volunteerid,
      role: "volunteer",
    };  
    const token = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: "3600s" }); // Expires in 1 hour
    return res.status(200).json({
      message: "Login successful",
      token,
      volunteer: {
        id: volunteer.id,
        role: "volunteer"
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}


async function comparePassword(req, res) {
  const password = req.params.pw;
  const volId = req.params.id;

  try{
    const volunteer = await Volunteer.getVolunteerById(volId)
    if (!volunteer) {
      return res.status(401).json({ message: "Invalid volunteer" });
    }
    // Compare password with hash
    const isMatch = await bcrypt.compare(password, volunteer.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    res.status(200).json({ message: "Password matches" })
  }
  catch (err) {
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
  }
}

async function changePassword(req, res) {
  const password = req.params.pw;
  const volId = req.params.id;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatedVolunteer = await Volunteer.updateVolunteerPassword(volId, hashedPassword)
    if (!updatedVolunteer) {
      return res.status(404).json({ message: "Volunteer not found" })
    }
    res.status(200).json({ message: "Volunteer updated successfully" })

  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
    }
}

async function searchVolunteers(req, res) {
  const searchTerm = req.query.searchTerm; // Extract search term from query params
  
  try {    
    const volunteers = await Volunteer.searchVolunteers(searchTerm);
    res.json(volunteers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching volunteers" });
  }
}


module.exports = {
    getMaxVolunteerId,
    getAllVolunteers,
    getVolunteerById,
    deleteVolunteer,
    getVolunteerSkills,
    createVolunteer,
    registerVolunteer,
    updateVolunteer,
    loginVolunteer,
    updateVolunteerProfilePicture,
    comparePassword,
    updateVolunteerPassword,
    changePassword,
    searchVolunteers
}
