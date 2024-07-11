const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const booksController = require("./controllers/booksController")
const usersController = require("./controllers/usersController")
const verifyJWT = require("./middleware")
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec
require("dotenv").config()

const app = express()
const port = process.env.PORT || 3000;
const staticMiddleware = express.static("public"); // Path to the public folder
// Serve the Swagger UI at a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(staticMiddleware)  

app.get("/books", verifyJWT,  booksController.getAllBooks)
app.patch("/books/:id/:availability", verifyJWT,  booksController.updateBookAvailability)

app.get("/users/:username", usersController.getUserByUsername)
app.post("/register", usersController.registerUser)
app.post("/login", usersController.login)


app.listen(port, async() => {
    try {
        await sql.connect(dbConfig);
        console.log("Database connection success")
    }
    catch (err) {
        console.error("Database connection error", err)
        //terminate process
        process.exit(1);
    }

    console.log(`Server listening on port ${port}`)
})

process.on("SIGINT", async() => {
    console.log("Server shutting down gracefully")
    //clean up tasks
    await sql.close()
    console.log("Database connection closed")
    process.exit(0) //code 0 is successful shutdown
})