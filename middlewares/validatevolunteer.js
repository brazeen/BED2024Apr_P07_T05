const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {


    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized - Missing Authorization header" });
    } 

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized - Missing token" });
    } 

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const authorizedRoles = {
            "/volunteers": ["Admin", "volunteer"],
            "/volunteers/:id": ["Admin", "volunteer"],
            "/volunteers/skills/:id": ["Admin", "volunteer"],
            "/volunteers/profilepicture/:id": ["Admin", "volunteer"],
            "/volunteers/:id/:hash": ["Admin", "volunteer"],
            "/volunteers/changepw/:id/:pw": ["Admin", "volunteer"],
            "/volunteers/:id/:pw": ["Admin", "volunteer"],
            "/volunteers/login": ["Admin", "volunteer"],
            
            "/ngos": ["Admin", "NGO"],
            "/ngos/status/:status": ["Admin", "NGO"],
            "/ngos/:id": ["Admin", "NGO"],
            "/ngos/:id/:status": ["Admin", "NGO"],
            "/ngos/logo/:id": ["Admin", "NGO"],
            "/ngos/changepw/:id/:pw": ["Admin", "NGO"],
            "/ngos/:id/:pw": ["Admin", "NGO"],

            "/applications/:id": ["Admin", "NGO", "volunteer"],
            "/applications/volunteer/:id": ["Admin", "NGO", "volunteer"],
            "/applications/:volunteerid/:opportunityid": ["Admin", "NGO", "volunteer"],
            "/applications/array/:opportunityid/:status": ["Admin", "NGO", "volunteer"],
            "/applications": ["Admin", "NGO"],
            "/applications/:volunteerid/:opportunityid/:status": ["Admin", "NGO", "volunteer"],
            "/applications/:volunteerid/:opportunityid": ["Admin", "NGO", "volunteer"],
            
            "/opportunities": ["Admin", "NGO", "volunteer"],
            "/opportunities/:id": ["Admin", "NGO", "volunteer"]
        };

        const requestedEndpoint = req.url;
        const volunteerRole = decoded.role;
        const volunteerid = decoded.id;

        const authorizedRole = Object.entries(authorizedRoles).find(
            ([endpoint, roles]) => {
                const regex = new RegExp(`^${endpoint.replace(/:[^\s/]+/g, '[^/]+')}$`);
                return regex.test(requestedEndpoint) && roles.includes(volunteerRole);
            }
        );

        if (!authorizedRole) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Attach user details to the request object for further use in the route handlers
        req.user = { volunteerid: volunteerid, volunteerRole: volunteerRole};
        next();
    }); 
}

module.exports = verifyJWT;
