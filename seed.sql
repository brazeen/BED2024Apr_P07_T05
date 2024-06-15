CREATE TABLE Volunteers (
    volunteerid INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    bio VARCHAR(255),
    dateofbirth DATE,
    profilepicture NVARCHAR(MAX),
);
 
CREATE TABLE Skills (
skillid INT PRIMARY KEY IDENTITY(1,1),
skillname VARCHAR(100),
);
 
CREATE TABLE VolunteerSkills (
id INT PRIMARY KEY IDENTITY(1,1),
skillid INT FOREIGN KEY REFERENCES Skills(skillid),
volunteerid INT FOREIGN KEY REFERENCES Volunteers(volunteerid),
);
 
-- Create NGO Table
CREATE TABLE NGOs (
    ngoid INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100),
    email NVARCHAR(100) UNIQUE,
    password NVARCHAR(100),
    logo NVARCHAR(MAX),
    description NVARCHAR(255),
    contactperson NVARCHAR(100),
    contactnumber NVARCHAR(20),
    address NVARCHAR(MAX),
    status VARCHAR(1)
);
 
-- Create Opportunity Table
CREATE TABLE Opportunities (
    opportunityid INT PRIMARY KEY IDENTITY(1,1),
    ngoid INT FOREIGN KEY REFERENCES NGOs(ngoid),
    title NVARCHAR(100),
    description NVARCHAR(255),
    datetime smalldatetime,
    maxvolunteers INT,
    currentVolunteers INT
);
 
CREATE TABLE OpportunitySkills (
id INT PRIMARY KEY IDENTITY(1,1),
skillid INT FOREIGN KEY REFERENCES Skills(skillid),
opportunityid INT FOREIGN KEY REFERENCES Opportunities(opportunityid),
);
 
-- Create Application Table
CREATE TABLE Applications (
    applicationid INT PRIMARY KEY IDENTITY(1,1),
    volunteerid INT FOREIGN KEY REFERENCES Volunteers(volunteerid),
    opportunityid INT FOREIGN KEY REFERENCES Opportunities(opportunityid),
    status NVARCHAR(1)
);
 
-- Create Admin Table 
CREATE TABLE Admins (
    adminid INT PRIMARY KEY IDENTITY(1,1),
    adminname NVARCHAR(100),
    adminpassword NVARCHAR(100),
);
