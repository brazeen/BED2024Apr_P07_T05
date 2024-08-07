const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser")
const volunteercontroller = require("./controllers/volunteercontroller")
const ngocontroller = require("./controllers/ngocontroller")
const applicationcontroller = require("./controllers/applicationcontroller")
const opportunitycontroller = require("./controllers/opportunitycontroller")
const admincontroller = require("./controllers/admincontroller")
const chatcontroller = require("./controllers/chatcontroller")
const skillcontroller = require("./controllers/skillcontroller")
const verifyJWT = require("./middlewares/validate")
const volupload = require('./middlewares/volupload');
const ngoupload = require('./middlewares/ngoupload');
const oppupload = require('./middlewares/oppupload');
const validateVolunteer = require('./middlewares/validateVolunteer');
const validateNGO = require('./middlewares/validateNGO');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec

require("dotenv").config()

const app = express();
const port = process.env.PORT || 3000;
const staticMiddleware = express.static("public");

// Serve the Swagger UI at a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(staticMiddleware);

//verifyJWT middleware to routes that need authentication
app.get('/users/validate', verifyJWT, (req, res) => {
    res.json(req.user); // Return the entire user object
});

// Volunteer routes
app.get("/volunteers/maxid", volunteercontroller.getMaxVolunteerId)
app.get("/volunteers", verifyJWT, volunteercontroller.getAllVolunteers)
app.get("/volunteers/:id", verifyJWT,volunteercontroller.getVolunteerById);
app.delete("/volunteers/:id", verifyJWT,volunteercontroller.deleteVolunteer);
app.get("/volunteers/skills/:id", verifyJWT,volunteercontroller.getVolunteerSkills);
app.post("/volunteers", validateVolunteer,volunteercontroller.registerVolunteer);
app.put("/volunteers/:id", verifyJWT, volunteercontroller.updateVolunteer);
app.post("/volunteers/login", volunteercontroller.loginVolunteer);
app.post('/volunteers/profilepicture/:id', verifyJWT,volupload.single('profilepicture'), volunteercontroller.updateVolunteerProfilePicture);
app.patch('/volunteers/:id/:hash', verifyJWT,volunteercontroller.updateVolunteerPassword);
app.patch('/volunteers/changepw/:id/:pw', verifyJWT,volunteercontroller.changePassword);
app.post("/volunteers/:id/:pw", verifyJWT,volunteercontroller.comparePassword);
app.get("/volunteers/search/user", verifyJWT, volunteercontroller.searchVolunteers)
app.get('/volunteers/:id/messages', verifyJWT,chatcontroller.getVolunteerMessages); // verifyjwt to be added
app.get('/volunteers/chats/:id', verifyJWT,chatcontroller.getVolunteerChats);
app.post('/volunteers/createMessage', verifyJWT,chatcontroller.createMessage); // verifyjwt to be added


// NGO routes
app.get("/ngos", verifyJWT,ngocontroller.getAllNGOs);
app.get("/ngos/status/:status", verifyJWT,ngocontroller.getNGOsByStatus); // status must be R, A or P
app.get("/ngos/:id", verifyJWT,ngocontroller.getNGOById);
app.put("/ngos/:id", verifyJWT, ngocontroller.updateNGO);
app.patch("/ngos/:id/:status", verifyJWT,ngocontroller.updateNGOStatus);
app.delete("/ngos/:id", verifyJWT,ngocontroller.deleteNGO);
app.post('/ngos/logo/:id', verifyJWT,ngoupload.single('logo'), ngocontroller.updateNGOLogo);
app.patch('/ngos/changepw/:id/:pw', verifyJWT,ngocontroller.changePassword)
app.post("/ngos/:id/:pw", verifyJWT,ngocontroller.comparePassword)
app.get("/ngos/search/user", verifyJWT, ngocontroller.searchAcceptedNGOs)
app.post("/ngos", validateNGO, ngocontroller.registerNGO);
app.get('/ngos/:id/messages', verifyJWT,chatcontroller.getNgoMessages); // verifyjwt to be added
app.get('/ngos/chats/:id', verifyJWT,chatcontroller.getNgoChats);
app.post('/ngos/createMessage', verifyJWT,chatcontroller.createMessage); // verifyjwt to be added
app.post('/ngos/login', ngocontroller.loginNGO);

// Application routes
app.get("/applications/:id", verifyJWT,applicationcontroller.getApplicationById); // by applicationid
app.get("/applications/volunteer/:id", verifyJWT,applicationcontroller.getApplicationByVolunteerId); // by applicationid
app.get("/applications/:volunteerid/:opportunityid", verifyJWT,applicationcontroller.getApplicationByVolunteerAndOpportunityId); // by vol and opp id
app.get("/applications/array/:opportunityid/:status", verifyJWT,applicationcontroller.getApplicationsByOpportunityandStatus); // by opportunityid and status
app.post("/applications", verifyJWT,applicationcontroller.createApplication);
app.patch("/applications/:volunteerid/:opportunityid/:status", verifyJWT,applicationcontroller.updateApplicationStatus);
app.delete("/applications/:volunteerid/:opportunityid", verifyJWT,applicationcontroller.deleteApplication);

// Opportunity routes
app.get("/opportunities/search/listing",verifyJWT, opportunitycontroller.searchOpportunity);
app.get("/opportunities", verifyJWT,opportunitycontroller.getAllOpportunities);
app.get("/opportunities/:id", verifyJWT,opportunitycontroller.getOpportunityById);
app.post("/opportunities", verifyJWT,opportunitycontroller.createOpportunity);
app.get("/opportunities/skills/:id", verifyJWT,opportunitycontroller.getOpportunitySkills);
app.patch("/opportunities/increment/:id", verifyJWT,opportunitycontroller.incrementOpportunityCurrentVolunteers);
app.delete("/opportunities/:id", verifyJWT,opportunitycontroller.deleteOpportunityById);
app.put("/opportunities/:id", verifyJWT,opportunitycontroller.updateOpportunity);
app.get("/opportunities/ngos/:id", verifyJWT, opportunitycontroller.getOpportunityByNGOid);
app.post("/opportunities/photo/:id", verifyJWT,oppupload.single('photo'), opportunitycontroller.createOppPhoto);

//skill routes
app.get("/skills/:skillname", skillcontroller.getSkillIdByName);
app.post("/skills/createVolunteerSkills", skillcontroller.createVolunteerSkills)
app.post("/skills", verifyJWT,skillcontroller.createOppSkills);
app.put("/skills/:id", verifyJWT, skillcontroller.updateOppSkills);
app.get("/skills/:id", verifyJWT, skillcontroller.getOpportunitySkillsById);

//admin routes
app.get("/admins/:name", admincontroller.getAdminByUsername)
app.post("/admins/login", admincontroller.loginAdmin)


//html routes
//common
app.get('/login', (req, res) => {
    res.redirect('/index.html')
});

//volunteer routes
app.get('/volunteer/index', verifyJWT, (req, res) => {
    res.redirect('/volindex.html');
});
app.get('/volunteer/profile', verifyJWT, (req, res) => {
    res.redirect('/volunteerprofilepage.html');
});
app.get('/login/volunteer', (req, res) => {
    res.redirect('/volunteerloginpage.html');
})

//ngo routes
app.get('/ngo/dashboard', verifyJWT, (req,res) => {
    res.redirect('/ngodashboard.html');
})
app.get('/ngo/profile', verifyJWT, (req, res) => {
    res.redirect('/ngoprofilepage.html');
})
app.get('/login/ngo', (req, res) => {
    res.redirect('/ngologinpage.html');
})
app.get('/register/ngo', (req, res) => {
    res.redirect('/ngosignuppage.html');
})
app.get('ngo/create', verifyJWT, (req, res) => {
    res.redirect('/ngocreate.html')
})

//admin routes
app.get('/login/admin', (req, res) => {
    res.redirect('/adminloginpage.html')
});
app.get('/admin/dashboard', verifyJWT, (req, res) => {
    res.redirect('/admindashboard.html');
});
app.get('/admin/applications', verifyJWT, (req, res) => {
    res.redirect('/adminapplications.html');
});
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
