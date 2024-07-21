const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");
const volunteercontroller = require("./controllers/volunteercontroller");
const ngocontroller = require("./controllers/ngocontroller");
const applicationcontroller = require("./controllers/applicationcontroller");
const opportunitycontroller = require("./controllers/opportunitycontroller");
const verifyJWT = require("./middlewares/validatevolunteer");
const bcrypt = require("bcrypt");
const upload = require('./middlewares/volupload');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const staticMiddleware = express.static("public");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticMiddleware);

/*verifyJWT middleware to routes that need authentication
app.use("/volunteers", verifyJWT);
app.use("/ngos", verifyJWT);
app.use("/applications", verifyJWT);
app.use("/opportunities", verifyJWT);*/

// Volunteer routes
app.get("/volunteers", volunteercontroller.getAllVolunteers);
app.get("/volunteers/:id", volunteercontroller.getVolunteerById);
app.delete("/volunteers/:id", volunteercontroller.deleteVolunteer);
app.get("/volunteers/skills/:id", volunteercontroller.getVolunteerSkills);
app.post("/volunteers", volunteercontroller.registerVolunteer);
app.put("/volunteers/:id", volunteercontroller.updateVolunteer);
app.post("/volunteers/login", volunteercontroller.loginVolunteer);
app.post('/volunteers/profilepicture/:id', upload.single('profilepicture'), volunteercontroller.updateVolunteerProfilePicture);
app.patch('/volunteers/:id/:hash', volunteercontroller.updateVolunteerPassword);
app.patch('/volunteers/changepw/:id/:pw', volunteercontroller.changePassword);
app.post("/volunteers/:id/:pw", volunteercontroller.comparePassword);

// NGO routes
app.get("/ngos", ngocontroller.getAllNGOs);
app.get("/ngos/status/:status", ngocontroller.getNGOsByStatus); // status must be R, A or P
app.get("/ngos/:id", ngocontroller.getNGOById);
app.put("/ngos/:id", ngocontroller.updateNGO);
app.patch("/ngos/:id/:status", ngocontroller.updateNGOStatus);
app.delete("/ngos/:id", ngocontroller.deleteNGO);
app.post('/ngos/logo/:id', upload.single('logo'), ngocontroller.updateNGOLogo);

// Application routes
app.get("/applications/:id", applicationcontroller.getApplicationById); // by applicationid
app.get("/applications/volunteer/:id", applicationcontroller.getApplicationByVolunteerId); // by applicationid
app.get("/applications/:volunteerid/:opportunityid", applicationcontroller.getApplicationByVolunteerAndOpportunityId); // by vol and opp id
app.get("/applications/array/:opportunityid/:status", applicationcontroller.getApplicationsByOpportunityandStatus); // by opportunityid and status
app.post("/applications", applicationcontroller.createApplication);
app.patch("/applications/:volunteerid/:opportunityid/:status", applicationcontroller.updateApplicationStatus);
app.delete("/applications/:volunteerid/:opportunityid", applicationcontroller.deleteApplication);

// Opportunity routes
app.get("/opportunities", opportunitycontroller.getAllOpportunities);
app.get("/opportunities/:id", opportunitycontroller.getOpportunityById);
app.post("/opportunities", opportunitycontroller.createOpportunity);
app.get("/opportunities/skills/:id", opportunitycontroller.getOpportunitySkills);
app.patch("/opportunities/increment/:id", opportunitycontroller.incrementOpportunityCurrentVolunteers);
app.delete("/opportunities/:id", opportunitycontroller.deleteOpportunityById);
app.put("/opportunities/:id", opportunitycontroller.updateOpportunity);
app.get("/opportunities/search", opportunitycontroller.searchOpportunity);

app.listen(port, async () => {
    try {
        await sql.connect(dbConfig);
        console.log("Database connection success");
    } catch (err) {
        console.error("Database connection error", err);
        process.exit(1);
    }

    console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
    console.log("Server shutting down gracefully");
    await sql.close();
    console.log("Database connection closed");
    process.exit(0);
});
