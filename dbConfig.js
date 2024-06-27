module.exports = {
    user: "volunteezy_admin", // Replace with your SQL Server login username
    password: "volunteezy", // Replace with your SQL Server login password
    server: "localhost",
    database: "Volunteezy",
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
  };