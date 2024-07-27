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
            "/volunteers/:id": ["admin", "volunteer", "ngo"],
            "/volunteers/skills/:id": ["admin", "volunteer", "ngo"],
            "/volunteers/profilepicture/:id": ["admin", "volunteer"],
            "/volunteers/:id/:hash": ["admin", "volunteer"],
            "/volunteers/changepw/:id/:pw": ["admin", "volunteer"],
            "/volunteers/:id/:pw": ["admin", "volunteer"],
            "/volunteers/login": ["admin", "volunteer"],
            "/volunteers/search/user": ["admin", "volunteer"],
            '/volunteers/:id/messages': ["admin", "volunteer"],
            '/volunteers/chats/:id' : ["admin", "volunteer"],
            '/volunteers/createMessage': ["admin", "volunteer"],
            
            "/ngos": ["admin", "ngo"],
            "/ngos/status/:status": ["admin", "ngo"],
            "/ngos/:id": ["admin", "ngo", "volunteer"],
            "/ngos/:id/:status": ["admin", "ngo"],
            "/ngos/logo/:id": ["admin", "ngo"],
            "/ngos/changepw/:id/:pw": ["admin", "ngo"],
            "/ngos/:id/:pw": ["admin", "ngo"],
            "/ngos/search/user": ["admin", "ngo"],
            '/ngos/:id/messages' : ["admin", "ngo"],
            '/ngos/chats/:id' : ["admin", "ngo"],
            '/ngos/createMessage' : ["admin", "ngo"],
        
            "/applications/:id": ["admin", "ngo", "volunteer"],
            "/applications/volunteer/:id": ["admin", "ngo", "volunteer"],
            "/applications/:volunteerid/:opportunityid": ["admin", "ngo", "volunteer"],
            "/applications/array/:opportunityid/:status": ["admin", "ngo", "volunteer"],
            "/applications": ["admin", "ngo"],
            "/applications/:volunteerid/:opportunityid/:status": ["admin", "ngo", "volunteer"],
            "/applications/:volunteerid/:opportunityid": ["admin", "ngo", "volunteer"],
            
            "/opportunities": ["admin", "ngo", "volunteer"],
            "/opportunities/:id": ["admin", "ngo", "volunteer"],
            "/opportunities/ngos/:id": ["admin", "ngo"],
            "/opportunities/increment/:id": ["admin", "ngo"],
            "/opportunities/skills/:id": ["admin", "ngo", "volunteer"],
            "/opportunities/search/listing": ["admin", "ngo","volunteer"],

            "/skills": ["admin", "ngo", "volunteer"],
            "/skills/:id": ["admin", "ngo"],
            "/admin/dashboard": ["admin"],
            "/admin/applications": ["admin"],

            '/users/validate' : ["admin", "ngo", "volunteer"]

        };        

        const requestedEndpoint = req.url;
        const role = decoded.role;
        const id = decoded.id;

        const authorizedRole = Object.entries(authorizedRoles).find(
            ([endpoint, roles]) => {
                const regex = new RegExp(`^${endpoint.replace(/:[^\s/]+/g, '[^/]+')}$`);
                return regex.test(requestedEndpoint) && roles.includes(role);
            }
        );

        if (!authorizedRole) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Attach user details to the request object for further use in the route handlers
        req.user = { id: id, role: role};
        next();
    }); 
}

module.exports = verifyJWT;
