const Application = require("../models/application")

const getApplicationById = async (req, res) => {
    const applicationid = req.params.id;
    try {
      const application = await Application.getApplicationById(applicationid);
      if (!application) {
        return res.status(404).send("Application not found")
      }
      res.json(application);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving application");
    }
};

const getApplicationsByOpportunityandStatus = async (req, res) => {
    const applicationid = req.params.id;
    const status = req.params.status;
    try {
        const application = await Application.getApplicationsByOpportunityandStatus(applicationid, status);
        if (!application) {
          return res.status(404).send("Application not found");
        }       
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error retrieving application")
    }
}

const createApplication = async (req, res) => {
    const newApplicationData = req.body;
    try {
        const createdApplication = await Application.createApplication(newApplicationData)
        res.status(201).json(createdApplication)
    }
    catch(error) {
        res.status(500).send("Error creating application")
    }
}

const deleteApplication = async (req, res) => {
    const applicationId = req.params.id;
    try {
        const application = await Application.deleteApplication(applicationId);
        if (!application) {
          return res.status(404).send("Application not found");
        }
        res.status(204).send()
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error deleting Application")
    }
}

/*
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










*/

module.exports = {
    getApplicationById,
    getApplicationsByOpportunityandStatus,
    createApplication,
    deleteApplication
}
