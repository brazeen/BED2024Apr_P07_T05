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

const getApplicationByVolunteerId = async (req, res) => {
  const volunteerid = req.params.id;
  try {
    const application = await Application.getApplicationByVolunteerId(volunteerid);
    if (!application) {
      return res.status(404).send("Application not found")
    }
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving application");
  }
};

const getApplicationByVolunteerAndOpportunityId = async (req, res) => {
    const volunteerid = req.params.volunteerid;
    const opportunityid = req.params.opportunityid;
    try {
      const application = await Application.getApplicationByVolunteerAndOpportunityId(volunteerid, opportunityid);
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
    const opportunityid = req.params.opportunityid;
    const status = req.params.status;
    try {
        const applications = await Application.getApplicationsByOpportunityandStatus(opportunityid, status);   
        res.json(applications)
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

const updateApplicationStatus = async (req, res) => {
    const volunteerid = req.params.volunteerid;
    const opportunityid = req.params.opportunityid;
    const status = req.params.status;
    try {
        const application = await Application.updateApplicationStatus(volunteerid, opportunityid, status);
        if (!application) {
          return res.status(404).send("Application not found");
        }   
        else {
            return res.status(200).send("Application status updated")
        }    
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error updating application")
    }
}

const deleteApplication = async (req, res) => {
    const volunteerid = req.params.volunteerid;
    const opportunityid = req.params.opportunityid;
    try {
        const application = await Application.deleteApplication(volunteerid, opportunityid);
        if (!application) {
          return res.status(404).send("Application not found");
        }
        res.status(204).send()
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error deleting application")
    }
}

module.exports = {
    getApplicationById,
    getApplicationByVolunteerId,
    getApplicationByVolunteerAndOpportunityId,
    getApplicationsByOpportunityandStatus,
    createApplication,
    updateApplicationStatus,
    deleteApplication
}
