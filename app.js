const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser")
const volunteercontroller = require("./controllers/volunteercontroller")
const ngocontroller = require("./controllers/ngocontroller")
const applicationcontroller = require("./controllers/applicationcontroller")
const opportunitycontroller = require("./controllers/opportunitycontroller")
const verifyJWT = require("./middlewares/validatevolunteer")
const bcrypt = require("bcrypt")
const volupload = require('./middlewares/volupload');
const ngoupload = require('./middlewares/ngoupload');
require("dotenv").config()

const app = express();
const port = process.env.PORT || 3000;
const staticMiddleware = express.static("public");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticMiddleware);

//verifyJWT middleware to routes that need authentication


// Volunteer routes
app.get('/volunteers', verifyJWT, (req, res) => {
    res.json(req.user); // Return the entire user object
});
app.get("/volunteers/:id", verifyJWT,volunteercontroller.getVolunteerById);
app.delete("/volunteers/:id", verifyJWT,volunteercontroller.deleteVolunteer);
app.get("/volunteers/skills/:id", verifyJWT,volunteercontroller.getVolunteerSkills);
app.post("/volunteers", verifyJWT,volunteercontroller.registerVolunteer);
app.put("/volunteers/:id", verifyJWT,volunteercontroller.updateVolunteer);
app.post("/volunteers/login", volunteercontroller.loginVolunteer);
app.post('/volunteers/profilepicture/:id', verifyJWT,volupload.single('profilepicture'), volunteercontroller.updateVolunteerProfilePicture);
app.patch('/volunteers/:id/:hash', verifyJWT,volunteercontroller.updateVolunteerPassword);
app.patch('/volunteers/changepw/:id/:pw', verifyJWT,volunteercontroller.changePassword);
app.post("/volunteers/:id/:pw", verifyJWT,volunteercontroller.comparePassword);

// NGO routes
app.get("/ngos", verifyJWT,ngocontroller.getAllNGOs);
app.get("/ngos/status/:status", verifyJWT,ngocontroller.getNGOsByStatus); // status must be R, A or P
app.get("/ngos/:id", verifyJWT,ngocontroller.getNGOById);
app.put("/ngos/:id", verifyJWT,ngocontroller.updateNGO);
app.patch("/ngos/:id/:status", verifyJWT,ngocontroller.updateNGOStatus);
app.delete("/ngos/:id", verifyJWT,ngocontroller.deleteNGO);
app.post('/ngos/logo/:id', verifyJWT,ngoupload.single('logo'), ngocontroller.updateNGOLogo);
app.patch('/ngos/changepw/:id/:pw', verifyJWT,ngocontroller.changePassword)
app.post("/ngos/:id/:pw", verifyJWT,ngocontroller.comparePassword)


// Application routes
app.get("/applications/:id", verifyJWT,applicationcontroller.getApplicationById); // by applicationid
app.get("/applications/volunteer/:id", verifyJWT,applicationcontroller.getApplicationByVolunteerId); // by applicationid
app.get("/applications/:volunteerid/:opportunityid", verifyJWT,applicationcontroller.getApplicationByVolunteerAndOpportunityId); // by vol and opp id
app.get("/applications/array/:opportunityid/:status", verifyJWT,applicationcontroller.getApplicationsByOpportunityandStatus); // by opportunityid and status
app.post("/applications", verifyJWT,applicationcontroller.createApplication);
app.patch("/applications/:volunteerid/:opportunityid/:status", verifyJWT,applicationcontroller.updateApplicationStatus);
app.delete("/applications/:volunteerid/:opportunityid", verifyJWT,applicationcontroller.deleteApplication);

// Opportunity routes
app.get("/opportunities", verifyJWT,opportunitycontroller.getAllOpportunities);
app.get("/opportunities/:id", verifyJWT,opportunitycontroller.getOpportunityById);
app.post("/opportunities", verifyJWT,opportunitycontroller.createOpportunity);
app.get("/opportunities/skills/:id", verifyJWT,opportunitycontroller.getOpportunitySkills);
app.patch("/opportunities/increment/:id", verifyJWT,opportunitycontroller.incrementOpportunityCurrentVolunteers);
app.delete("/opportunities/:id", verifyJWT,opportunitycontroller.deleteOpportunityById);
app.put("/opportunities/:id", verifyJWT,opportunitycontroller.updateOpportunity);

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
