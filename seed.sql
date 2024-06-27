-- Drop Tables if they exist
DROP TABLE IF EXISTS Applications;
DROP TABLE IF EXISTS OpportunitySkills;
DROP TABLE IF EXISTS Opportunities;
DROP TABLE IF EXISTS VolunteerSkills;
DROP TABLE IF EXISTS Volunteers;
DROP TABLE IF EXISTS Skills;
DROP TABLE IF EXISTS NGOs;
DROP TABLE IF EXISTS Admins;


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
    address NVARCHAR(255),
    region NVARCHAR(10),
    date date,
    starttime, time,
    endtime time, 
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
       (3, 3),  -- Volunteer 3 has skill 3
       (1, 1);  -- Volunteer 1 has skill 1

-- NGO population
INSERT INTO NGOs (name, email, password, logo, description, contactperson, contactnumber, address, status) 

VALUES ('Animal Shelter', 'animalshelter@example.com', 'sheltercare', 'https://images.wsj.net/im-831237?width=1280&size=1.33333333', 'Provides care and adoption services for homeless pets.', 'John Johnson', '555-123-4567', '123 Main St, Anytown, CA 12345', 'A'), 

       ('Food Bank', 'foodbank@example.com', 'feedtheneedy', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_PW2BsuN_3oL96einYF1zuZdMrTO7MTbXLw&s', 'Distributes food to those in need in our community.', 'Jane Doe', '555-789-0123', '456 Elm St, Anytown, TX 78901', 'A'), 

       ('Literacy Program', 'literacyprogram@example.com', 'learningforall', 'https://www.eschoolnews.com/files/2023/05/online-literacy-program.jpeg', 'Helps adults and children learn to read and write.', 'Michael Smith', '555-456-7890', '789 Maple St, Anytown, NY 09876', 'R'), 

       ('Environmental Cleanup', 'cleanupcrew@example.com', 'gogreen', 'https://cleanmanagement.com/wp-content/uploads/2022/02/CleanManagementEnvironmentalGroup-106513-Waste-Cleanup-Essential-Image1.jpg', 'Organizes cleanups of parks, beaches, and other areas.', 'Sarah Jones', '555-012-3456', '1011 Oak St, Anytown, FL 32101', 'A'), 

       ('Soup Kitchen', 'soupkitchengoals@example.com', 'nourishinglives', 'https://static.wixstatic.com/media/950ec0_7557c389547c46bf8b123167dacf9936~mv2.webp', 'Provides hot meals to those in need.', 'David Williams', '555-345-6789', '1213 Pine St, Anytown, WA 98765', 'P'); 

-- Opportunity population
INSERT INTO Opportunities (ngoid, title, description, address, region, date, starttime, endtime, maxvolunteers, currentVolunteers)
VALUES 
-- Animal Shelter
(1, 'Pet Adoption Drive', 'Help organize an adoption drive for stray animals.', '80 Mandai Lake Rd, Singapore Zoo', 'North', '2025-03-15', '10:00', '14:00', 50, 30),
(1, 'Shelter Maintenance', 'Assist in cleaning and maintaining the animal shelter.', '50 Sungei Tengah Rd, Animal Shelter', 'North', '2025-06-12', '09:00', '13:00', 30, 15),
(1, 'Fundraising Gala', 'Support fundraising efforts for the animal shelter.', '10 Woodlands Square, Causeway Point', 'North', '2025-09-20', '19:00', '22:00', 100, 45),
-- Food Bank
(2, 'Food Distribution', 'Distribute food to families in need.', '1 Tampines Walk, Our Tampines Hub', 'East', '2025-04-05', '14:00', '18:00', 40, 20),
(2, 'Warehouse Sorting', 'Sort food donations at our warehouse.', '18 Bedok North St 5, Bedok Industrial Park', 'East', '2025-07-10', '11:00', '15:00', 25, 18),
(2, 'Community Kitchen', 'Prepare meals for the underprivileged.', '200 Sims Ave, Geylang', 'East', '2025-10-25', '08:00', '12:00', 35, 28),
-- Literacy Program
(3, 'Reading Session', 'Conduct reading sessions for children.', '298 Yishun St 20, Northpoint City', 'North', '2025-02-28', '16:00', '18:00', 20, 12),
(3, 'Book Donation Drive', 'Organize a book donation event.', '3 Bukit Panjang Ring Rd, Hillion Mall', 'West', '2025-05-22', '10:00', '14:00', 60, 40),
(3, 'Tutoring Program', 'Provide tutoring for underprivileged children.', '31 Jurong West Central 3, Jurong Point', 'West', '2025-08-15', '17:00', '20:00', 30, 25),
-- Environmental Cleanup
(4, 'Beach Cleanup', 'Join us in cleaning up East Coast Park.', 'East Coast Park, Marine Parade', 'East', '2025-03-22', '07:00', '12:00', 100, 60),
(4, 'Park Maintenance', 'Help maintain the greenery at Bishan Park.', '1384 Ang Mo Kio Ave 1, Bishan Park', 'Central', '2025-06-18', '09:00', '13:00', 50, 30),
(4, 'Community Garden', 'Assist in managing a community garden.', 'Bukit Batok Nature Park', 'West', '2025-09-10', '08:00', '12:00', 40, 25),
-- Soup Kitchen
(5, 'Soup Kitchen Service', 'Serve meals to the homeless.', '27 Kreta Ayer Rd, Chinatown', 'Central', '2025-01-10', '11:00', '14:00', 45, 30),
(5, 'Meal Preparation', 'Prepare meals for distribution.', 'Blk 531A Upper Cross St, Hong Lim Complex', 'Central', '2025-07-05', '06:00', '10:00', 30, 18),
(5, 'Volunteer Training', 'Train new volunteers at the soup kitchen.', '10 Sinaran Dr, Novena', 'Central', '2025-11-22', '09:00', '12:00', 25, 15);


-- OpportunitySkills population
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (3, 1); -- Friendly for Pet Adoption Drive
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (5, 2); -- Physical for Shelter Maintenance
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (1, 3); -- Communication for Fundraising Gala
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (6, 3); -- Leadership for Fundraising Gala
-- Food Bank
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (2, 4); -- Teamwork for Food Distribution
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (5, 5); -- Physical for Warehouse Sorting
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (7, 6); -- Time Management for Community Kitchen
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (4, 6); -- Tech for Community Kitchen
-- Literacy Program
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (1, 7); -- Communication for Reading Session
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (3, 7); -- Friendly for Reading Session
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (6, 8); -- Leadership for Book Donation Drive
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (1, 9); -- Communication for Tutoring Program
-- Environmental Cleanup
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (5, 10); -- Physical for Beach Cleanup
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (2, 10); -- Teamwork for Beach Cleanup
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (5, 11); -- Physical for Park Maintenance
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (7, 12); -- Time Management for Community Garden
-- Soup Kitchen
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (3, 13); -- Friendly for Soup Kitchen Service
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (2, 13); -- Teamwork for Soup Kitchen Service
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (4, 14); -- Tech for Meal Preparation
INSERT INTO OpportunitySkills (skillid, opportunityid) VALUES (6, 15); -- Leadership for Volunteer Training

-- Applications population
INSERT INTO Applications (volunteerid, opportunityid, status)
VALUES
  (1, 1, 'P'), -- Volunteer 1 applies (pending) for Pet Adoption Drive (1)
  (2, 2, 'P'), -- Volunteer 2 applies (pending) for Food Distribution (2)
  (3, 3, 'A'), -- Volunteer 3 is accepted for Reading Session (3)
  (4, 4, 'P'), -- Volunteer 4 applies (pending) for Beach Cleanup (4)
  (5, 5, 'A'), -- Volunteer 5 is accepted for Soup Kitchen Service (5)
  (2, 6, 'P'), -- Volunteer 2 applies (pending) for Warehouse Sorting (6)
  (1, 7, 'P'), -- Volunteer 1 applies (pending) for Fundraising Gala (7)
  (3, 8, 'P'), -- Volunteer 3 applies (pending) for Book Donation Drive (8)
  (4, 9, 'P'), -- Volunteer 4 applies (pending) for Park Maintenance (9)
  (5, 10, 'A'); -- Volunteer 5 is accepted for Meal Preparation (10);

-- Admin population
INSERT INTO Admins (adminname, adminpassword)
VALUES 
('Jessica Liu', 'password123!'),
('Michael Tan', 'securePass45#'),
('Samantha Lee', 'admin!Pass78');



