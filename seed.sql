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

-- Volunteer population
INSERT INTO Volunteers (name, email, password, bio, dateofbirth, profilepicture) 

VALUES ('John Doe', 'johndoe@example.com', 'password123', 'Friendly and passionate volunteer with experience in animal care.', '1990-01-01', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/John_Doe%2C_born_John_Nommensen_Duchac.jpg/1200px-John_Doe%2C_born_John_Nommensen_Duchac.jpg'), 

       ('Jane Smith', 'janesmith@example.com', 'securepassword', 'Enthusiastic volunteer with a background in education and literacy programs.', '1985-07-15', 'https://i.pinimg.com/736x/2a/26/df/2a26df12b8fab576a93f244212cb6673.jpg'), 

       ('Michael Jones', 'michaeljones@example.com', 'strongpass', 'Dedicated volunteer skilled in leadership and project management.', '1978-12-31', 'https://img1.hscicdn.com/image/upload/f_auto/lsci/db/PICTURES/CMS/322400/322444.png'), 

       ('Sarah Lee', 'sarahlee@example.com', 'volunteerlife', 'Energetic volunteer with a love for the outdoors and environmental causes.', '1995-03-09', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj3jCk3cT8zoC9zbPx2SCzL51933otGv_fKQ&s'), 

       ('David Williams', 'davidwilliams@example.com', 'helpinghands', 'Tech-savvy volunteer eager to contribute their skills to worthy organizations.', '1982-05-24', 'https://upload.wikimedia.org/wikipedia/commons/9/93/Ashleigh_and_David_Walliams_%28the_voice_of_Pudsey_in_the_movie%29_%28cropped%29.JPG'); 

-- Skill population
INSERT INTO Skills (skillname) VALUES ('Communication');
INSERT INTO Skills (skillname) VALUES ('Teamwork');
INSERT INTO Skills (skillname) VALUES ('Friendly');
INSERT INTO Skills (skillname) VALUES ('Tech');
INSERT INTO Skills (skillname) VALUES ('Physical');
INSERT INTO Skills (skillname) VALUES ('Leadership');
INSERT INTO Skills (skillname) VALUES ('Time Management');

-- VolunteerSkills population
INSERT INTO VolunteerSkills (skillid, volunteerid)
VALUES (3, 2),  -- Volunteer 2 has skill 3
       (6, 2),  -- Volunteer 2 has skill 6
       (4, 4),  -- Volunteer 4 has skill 4
       (5, 5),  -- Volunteer 5 has skill 5
       (3, 6);  -- Volunteer 6 has skill 3
       (1, 1),  -- Volunteer 1 has skill 1

-- NGO population
INSERT INTO NGOs (name, email, password, logo, description, contactperson, contactnumber, address, status) 

VALUES ('Animal Shelter', 'animalshelter@example.com', 'sheltercare', 'https://images.wsj.net/im-831237?width=1280&size=1.33333333', 'Provides care and adoption services for homeless pets.', 'John Johnson', '555-123-4567', '123 Main St, Anytown, CA 12345', 'A'), 

       ('Food Bank', 'foodbank@example.com', 'feedtheneedy', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_PW2BsuN_3oL96einYF1zuZdMrTO7MTbXLw&s', 'Distributes food to those in need in our community.', 'Jane Doe', '555-789-0123', '456 Elm St, Anytown, TX 78901', 'A'), 

       ('Literacy Program', 'literacyprogram@example.com', 'learningforall', 'https://www.eschoolnews.com/files/2023/05/online-literacy-program.jpeg', 'Helps adults and children learn to read and write.', 'Michael Smith', '555-456-7890', '789 Maple St, Anytown, NY 09876', 'R'), 

       ('Environmental Cleanup', 'cleanupcrew@example.com', 'gogreen', 'https://cleanmanagement.com/wp-content/uploads/2022/02/CleanManagementEnvironmentalGroup-106513-Waste-Cleanup-Essential-Image1.jpg', 'Organizes cleanups of parks, beaches, and other areas.', 'Sarah Jones', '555-012-3456', '1011 Oak St, Anytown, FL 32101', 'A'), 

       ('Soup Kitchen', 'soupkitchengoals@example.com', 'nourishinglives', 'https://static.wixstatic.com/media/950ec0_7557c389547c46bf8b123167dacf9936~mv2.webp', 'Provides hot meals to those in need.', 'David Williams', '555-345-6789', '1213 Pine St, Anytown, WA 98765', 'P'); 

-- Opportunity population
--settle location thingy first

-- OpportunitySkills population
--settle opportunity table first

-- Admin population
INSERT INTO Admins (adminname, adminpassword)
VALUES 
('Jessica Liu', 'password123!'),
('Michael Tan', 'securePass45#'),
('Samantha Lee', 'admin!Pass78');



