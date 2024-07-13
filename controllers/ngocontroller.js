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
        const ngo = await NGO.updateNGOProfilePicture(ngoId, imagepath)
        
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
}
