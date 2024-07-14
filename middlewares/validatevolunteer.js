const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const authorizedRoles = {
            "/volunteers": ["Admin", "Volunteer"],
            "/volunteers/:id": ["Admin", "Volunteer"],
            "/volunteers/skills/:id": ["Admin", "Volunteer"],
            "/volunteers/profilepicture/:id": ["Admin", "Volunteer"],
            "/volunteers/:id/:hash": ["Admin", "Volunteer"],
            "/volunteers/changepw/:id/:pw": ["Admin", "Volunteer"],
            "/volunteers/:id/:pw": ["Admin", "Volunteer"],
            
            "/ngos": ["Admin", "NGO"],
            "/ngos/status/:status": ["Admin", "NGO"],
            "/ngos/:id": ["Admin", "NGO"],
            "/ngos/:id/:status": ["Admin", "NGO"],
            "/ngos/logo/:id": ["Admin", "NGO"],

            "/applications/:id": ["Admin", "NGO", "Volunteer"],
            "/applications/volunteer/:id": ["Admin", "NGO"],
            "/applications/:volunteerid/:opportunityid": ["Admin", "NGO"],
            "/applications/array/:opportunityid/:status": ["Admin", "NGO", "Volunteer"],
            "/applications": ["Admin", "NGO"],
            "/applications/:volunteerid/:opportunityid/:status": ["Admin", "NGO"],
            "/applications/:volunteerid/:opportunityid": ["Admin", "NGO"],
            
            "/opportunities": ["Admin", "NGO", "Volunteer"],
        };

        const requestedEndpoint = req.baseUrl + req.path;
        const userRole = decoded.role;

        const authorizedRole = Object.entries(authorizedRoles).find(
            ([endpoint, roles]) => {
                const regex = new RegExp(`^${endpoint.replace(/:[^\s/]+/g, '[^/]+')}$`);
                return regex.test(requestedEndpoint) && roles.includes(userRole);
            }
        );

        if (!authorizedRole) {
            return res.status(403).json({ message: "Forbidden" });
        }

        req.user = {
            id: decoded.id,
            role: decoded.role,
        };
        next();
    });
}

module.exports = verifyJWT;
