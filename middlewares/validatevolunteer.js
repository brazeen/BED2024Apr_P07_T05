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
            "/volunteers": ["admin", "volunteer"],
            "/volunteers/:id": ["admin", "volunteer"],
            "/volunteers/skills/:id": ["admin", "volunteer"],
            "/volunteers/profilepicture/:id": ["admin", "volunteer"],
            "/volunteers/:id/:hash": ["admin", "volunteer"],
            "/volunteers/changepw/:id/:pw": ["admin", "volunteer"],
            "/volunteers/:id/:pw": ["admin", "volunteer"],
            "/volunteers/login": ["admin", "volunteer"],
            
            "/ngos": ["admin", "ngo"],
            "/ngos/status/:status": ["admin", "ngo"],
            "/ngos/:id": ["admin", "ngo"],
            "/ngos/:id/:status": ["admin", "ngo"],
            "/ngos/logo/:id": ["admin", "ngo"],
        
            "/applications/:id": ["admin", "ngo", "volunteer"],
            "/applications/volunteer/:id": ["admin", "ngo", "volunteer"],
            "/applications/:volunteerid/:opportunityid": ["admin", "ngo", "volunteer"],
            "/applications/array/:opportunityid/:status": ["admin", "ngo", "volunteer"],
            "/applications": ["admin", "ngo"],
            "/applications/:volunteerid/:opportunityid/:status": ["admin", "ngo", "volunteer"],
            "/applications/:volunteerid/:opportunityid": ["admin", "ngo", "volunteer"],
            
            "/opportunities": ["admin", "ngo", "volunteer"],
            "/opportunities/:id": ["admin", "ngo", "volunteer"]
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
