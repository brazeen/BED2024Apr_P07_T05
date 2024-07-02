module.exports = {
    user: "polytechinic_library_user", // Replace with your SQL Server login username
    password: "ngeeannpoly", // Replace with your SQL Server login password
    server: "localhost",
    database: "Polytechnic Library",
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
  };