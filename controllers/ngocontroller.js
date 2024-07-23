const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const path = require('path');
const NGO = require("../models/ngo")

const getAllNGOs = async (req, res) => {
    try {
        const ngos = await NGO.getAllNGOs()
        res.json(ngos)
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error retrieving NGOs")
    }
}

const getNGOsByStatus = async (req, res) => {
    const ngostatus = req.params.status;
    try {
      const ngos = await NGO.getNGOsByStatus(ngostatus);
      res.json(ngos);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving NGOs");
    }
};

const getNGOById = async (req, res) => {
    const ngoid = req.params.id;
    try {
      const ngo = await NGO.getNGOById(ngoid);
      if (!ngo) {
        return res.status(404).send("NGO not found")
      }
      res.json(ngo);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving NGO");
    }
};

const updateNGO = async (req, res) => {
    const ngoId = req.params.id;
    const newNGOData = req.body;
    try {
        const ngo = await NGO.updateNGO(ngoId, newNGOData);
        if (!ngo) {
          return res.status(404).send("NGO not found");
        }       
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error updating NGO")
    }
}

const updateNGOStatus = async (req, res) => {
    const ngoId = req.params.id;
    const status = req.params.status;
    try {
        const ngo = await NGO.updateNGOStatus(ngoId, status);
        if (!ngo) {
          return res.status(404).send("NGO not found");
        }   
        else {
            return res.status(200).send("NGO status updated")
        }    
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error updating NGO")
    }
}

const updateNGOLogo = async (req, res) => {
    const ngoId = req.params.id;
    const newPhoto = req.file;
    const imagepath = newPhoto.path.slice(6);
    try {
        const ngo = await NGO.updateNGOLogo(ngoId, imagepath)
        
        if (!ngo) {
          return res.status(404).send("NGO not found");
        }
        res.status(201) //send a OK status code
        
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error updating NGO logo")
    }
  }

const deleteNGO = async (req, res) => {
    const NGOId = req.params.id;
    try {
        const ngo = await NGO.deleteNGO(NGOId);
        if (!ngo) {
          return res.status(404).send("NGO not found");
        }
        res.status(204).send()
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error deleting NGO")
    }
}

async function comparePassword(req, res) {
    const password = req.params.pw;
    const ngoId = req.params.id;
  
    try{
      const ngo = await NGO.getNGOById(ngoId);
      if (!ngo) {
        return res.status(401).json({ message: "Invalid NGO" });
      }
      // Compare password with hash
      const isMatch = await bcrypt.compare(password, ngo.passwordHash);
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
  const ngoId = req.params.id;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatedngo = await NGO.updateNGOPassword(ngoId, hashedPassword)
    if (!updatedngo) {
      return res.status(404).json({ message: "NGO not found" })
    }
    res.status(200).json({ message: "NGO updated successfully" })

  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
    }
}

async function loginNGO(req, res) {
  const { email, password } = req.body;

  try {
    // Validate user credentials
    const ngo = await NGO.getNGOByEmail(email);
    if (!ngo) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Compare password with hash
    const isMatch = await bcrypt.compare(password, ngo.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      id: ngo.ngoid,
      role: "ngo",
    };  
    const token = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: "3600s" }); // Expires in 1 hour
    return res.status(200).json({
      message: "Login successful",
      token,
      ngo: {
        id: ngo.id,
        role: "ngo"
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
    const ngo = await Volunteer.getNGOById(ngoId)
    if (!ngo) {
      return res.status(401).json({ message: "Invalid NGO" });
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


async function searchAcceptedNGOs(req, res) {
  const searchTerm = req.query.searchTerm; // Extract search term from query params
  
  try {    
    const ngos = await NGO.searchAcceptedNGOs(searchTerm);
    res.json(ngos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching NGOs" });
  }
}

const createNGO = async (req, res) => {
  const newNGO = req.body;
  try {
      const createdNGO = await NGO.createNGO(newNGO)
      res.status(201).json(createdNGO)
  }
  catch(error) {
      res.status(500).send("Error creating NGO")
  }
}


async function registerNGO(req, res) {
  const { name, email, password, description, contactperson, contactnumber, address, logo , status} = req.body;
  const relativePath = path.join('./public/images', `${name}_logo.jpg`);
  try {
    // Validate user data
    if (String(password).length < 5) {
      return res.status(400).json({ message: "Password too short" });
    }
    // Check for existing username
    const existingNGO = await NGO.getNGOByName(name);
    if (existingNGO) {
      return res.status(400).json({ message: "Username already exists" });
    }
    //check for existing email
    const existingNGOByEmail = await NGO.getNGOByEmail(email);
    if (existingNGOByEmail) {
        return res.status(400).json({ message: "Email already exists" });
    }
    console.log(req.body)
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    const newNGO = {name: name, email: email, passwordHash: hashedPassword, description: description, contactperson: contactperson, contactnumber: contactnumber, address: address, logo: relativePath, status: status}
    const createdNGO = await NGO.createNGO(newNGO);
    return res.status(201).json({ message: "NGO created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const getNGOByName = async (req, res) => {
  const ngoname = req.params.name;
  try {
    const ngo = await NGO.getNGOById(ngoname);
    if (!ngo) {
      return res.status(404).send("NGO not found")
    }
    res.json(ngo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving NGO");
  }
};

/*


const createBook = async (req, res) => {
    const newBook = req.body;
    try {
        const createdBook = await Book.createBook(newBook)
        res.status(201).json(createdBook)
    }
    catch(error) {
        res.status(500).send("Error creating book")
    }
}





*/

module.exports = {
    getAllNGOs,
    getNGOsByStatus,
    getNGOById,
    updateNGO,
    updateNGOStatus,
    updateNGOLogo,
    deleteNGO,
    changePassword,
    comparePassword,
    searchAcceptedNGOs,
    loginNGO,
    createNGO,
    registerNGO,
    getNGOByName
}
