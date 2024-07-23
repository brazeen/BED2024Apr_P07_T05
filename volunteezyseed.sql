-- Drop Tables if they exist
DROP TABLE IF EXISTS Applications;
DROP TABLE IF EXISTS OpportunitySkills;
DROP TABLE IF EXISTS Opportunities;
DROP TABLE IF EXISTS VolunteerSkills;
DROP TABLE IF EXISTS Volunteers;
DROP TABLE IF EXISTS Skills;
DROP TABLE IF EXISTS NGOs;
DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS Messages;

CREATE TABLE Volunteers (
    volunteerid INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    passwordHash VARCHAR(100),
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
skillid INT FOREIGN KEY REFERENCES Skills(skillid) ON DELETE CASCADE,
volunteerid INT FOREIGN KEY REFERENCES Volunteers(volunteerid) ON DELETE CASCADE,
);
 
-- Create NGO Table
CREATE TABLE NGOs (
    ngoid INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100),
    email NVARCHAR(100) UNIQUE,
    passwordHash NVARCHAR(100),
    logo NVARCHAR(MAX),
    description NVARCHAR(255),
    contactperson NVARCHAR(100),
    contactnumber NVARCHAR(20),
    address NVARCHAR(MAX),
    status VARCHAR(1) CHECK (status IN ('P', 'A', 'R'))
);
 
-- Create Opportunity Table
CREATE TABLE Opportunities (
    opportunityid INT PRIMARY KEY IDENTITY(1,1),
    ngoid INT FOREIGN KEY REFERENCES NGOs(ngoid) ON DELETE CASCADE,
    title NVARCHAR(100),
    description NVARCHAR(255),
    address NVARCHAR(255),
    region NVARCHAR(10),
    date date,
    starttime time,
    endtime time, 
    age INT,
    maxvolunteers INT,
    currentvolunteers INT,
    photo NVARCHAR(MAX)
);
 
CREATE TABLE OpportunitySkills (
id INT PRIMARY KEY IDENTITY(1,1),
skillid INT FOREIGN KEY REFERENCES Skills(skillid) ON DELETE CASCADE,
opportunityid INT FOREIGN KEY REFERENCES Opportunities(opportunityid) ON DELETE CASCADE,
);
 
-- Create Application Table
CREATE TABLE Applications (
    applicationid INT PRIMARY KEY IDENTITY(1,1),
    volunteerid INT FOREIGN KEY REFERENCES Volunteers(volunteerid) ON DELETE CASCADE,
    opportunityid INT FOREIGN KEY REFERENCES Opportunities(opportunityid) ON DELETE CASCADE,
    status NVARCHAR(1) CHECK (status IN ('R', 'P', 'A'))
);
 
-- Create Admin Table 
CREATE TABLE Admins (
    adminid INT PRIMARY KEY IDENTITY(1,1),
    adminname NVARCHAR(100),
    adminpasswordHash NVARCHAR(100),
);

CREATE TABLE Messages (
    messageid INT PRIMARY KEY IDENTITY(1,1),
    volunteerid INT FOREIGN KEY REFERENCES Volunteers(volunteerid) ON DELETE CASCADE,
    ngoid INT FOREIGN KEY REFERENCES NGOs(ngoid) ON DELETE CASCADE,
    content NVARCHAR(500),
    timestamp DATETIME DEFAULT GETDATE()
)

-- Volunteer population
INSERT INTO Volunteers (name, email, passwordHash, bio, dateofbirth, profilepicture) 

VALUES ('John Doe', 'johndoe@example.com', '$2b$10$4eIfPXGkq6MI.lQ3DKuVm.GWY3HIQNIlib78kJqloNbrA4pGx5Ljm', 'Friendly and passionate volunteer with experience in animal care.', '1990-01-01', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/John_Doe%2C_born_John_Nommensen_Duchac.jpg/1200px-John_Doe%2C_born_John_Nommensen_Duchac.jpg'), 
        /*john doe password123*/
       ('Jane Smith', 'janesmith@example.com', '$2b$10$5am6NiuC2f5TZQ/woTCOJe8TcXUr/p.4LBoApWZpm7EflR5Sdr5Ky', 'Enthusiastic volunteer with a background in education and literacy programs.', '1985-07-15', 'https://i.pinimg.com/736x/2a/26/df/2a26df12b8fab576a93f244212cb6673.jpg'), 
        /*jane smith securepassword*/
       ('Michael Jones', 'michaeljones@example.com', '$2b$10$ai6pTWGlP6qM2HCPLoUTP.w/DiZPcIO80HtW6AQTkFszG7BLHdV.q', 'Dedicated volunteer skilled in leadership and project management.', '1978-12-31', 'https://img1.hscicdn.com/image/upload/f_auto/lsci/db/PICTURES/CMS/322400/322444.png'), 
        /*michael jones securepass*/
       ('Sarah Lee', 'sarahlee@example.com', '$2b$10$iccxMzQqBluq5w7SuXtDye/IXc2gaFYiPhHJA26PMCtg65tpBITPu', 'Energetic volunteer with a love for the outdoors and environmental causes.', '1995-03-09', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj3jCk3cT8zoC9zbPx2SCzL51933otGv_fKQ&s'), 
        /*michael jones volunteerlife*/
       ('David Williams', 'davidwilliams@example.com', '$2b$10$7NlnYO3tf7qAWcTZA14ZfuaGi3ae/rq5X6q6TsohjIxCAjhk4xiwK', 'Tech-savvy volunteer eager to contribute their skills to worthy organizations.', '1982-05-24', 'https://upload.wikimedia.org/wikipedia/commons/9/93/Ashleigh_and_David_Walliams_%28the_voice_of_Pudsey_in_the_movie%29_%28cropped%29.JPG'); 
        /*david williams helpinghands*/

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
INSERT INTO NGOs (name, email, passwordHash, logo, description, contactperson, contactnumber, address, status) 

VALUES ('Animal Shelter', 'animalshelter@example.com', '$2b$10$XF7JI2iz22TIbDbdMACRXuNn/Z/T6GNeKBP1gQWYdbXu6odSUnlzq', 'https://images.wsj.net/im-831237?width=1280&size=1.33333333', 'Provides care and adoption services for homeless pets.', 'John Johnson', '555-123-4567', '123 Main St, Anytown, CA 12345', 'A'), 
        /*animal shelter sheltercare*/
       ('Food Bank', 'foodbank@example.com', '$2b$10$Yokhl4XqXD7rTtM1Cs2Ut.yllptuv9p5PcXUCyeCRjpv/QWAuYsSq', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_PW2BsuN_3oL96einYF1zuZdMrTO7MTbXLw&s', 'Distributes food to those in need in our community.', 'Jane Doe', '555-789-0123', '456 Elm St, Anytown, TX 78901', 'A'), 
        /*food bank feedtheneedy*/
       ('Literacy Program', 'literacyprogram@example.com', '$2b$10$bemjJgeHd9qz16.87/XCouJhUjISNv/cLZGJt5WPZ50y8AmzZEf5W', 'https://www.eschoolnews.com/files/2023/05/online-literacy-program.jpeg', 'Helps adults and children learn to read and write.', 'Michael Smith', '555-456-7890', '789 Maple St, Anytown, NY 09876', 'R'), 
        /*literacy program learningforall*/
       ('Environmental Cleanup', 'cleanupcrew@example.com', '$2b$10$GsF8g5FSr7yi0obNSxt0eOwYO8oPID9oM64VUQzxbiZBV1g3ODdva', 'https://cleanmanagement.com/wp-content/uploads/2022/02/CleanManagementEnvironmentalGroup-106513-Waste-Cleanup-Essential-Image1.jpg', 'Organizes cleanups of parks, beaches, and other areas.', 'Sarah Jones', '555-012-3456', '1011 Oak St, Anytown, FL 32101', 'A'), 
        /*environmental cleanup gogreen*/
       ('Soup Kitchen', 'soupkitchengoals@example.com', '$2b$10$QsjlfLY0Ui2z/RDVvxPGmefl47ecFG0kZbn2bnM2gBLrQh.KJWyBG', 'https://static.wixstatic.com/media/950ec0_7557c389547c46bf8b123167dacf9936~mv2.webp', 'Provides hot meals to those in need.', 'David Williams', '555-345-6789', '1213 Pine St, Anytown, WA 98765', 'P'); 
        /*soup kitchen nourishinglives*/
-- Opportunity population
INSERT INTO Opportunities (ngoid, title, description, address, region, date, starttime, endtime, age, maxvolunteers, currentvolunteers, photo)
VALUES 
-- Animal Shelter
(1, 'Pet Adoption Drive', 'Help organize an adoption drive for stray animals.', '80 Mandai Lake Rd, Singapore Zoo', 'North', '2025-03-15', '10:00', '14:00', 20, 50, 30, 'https://singaporepoloclub.org/images/dogadoption/060_MG_4651.jpg'),
(1, 'Shelter Maintenance', 'Assist in cleaning and maintaining the animal shelter.', '50 Sungei Tengah Rd, Animal Shelter', 'North', '2025-06-12', '09:00', '13:00',17, 30, 15, 'https://humanepro.org/sites/default/files/styles/article_new/public/images/hero/_DSC0043_77793.JPG?itok=P3cW440c'),
(1, 'Fundraising Gala', 'Support fundraising efforts for the animal shelter.', '10 Woodlands Square, Causeway Point', 'North', '2025-09-20', '19:00', '22:00', 21, 100, 45, 'https://www.iberdrola.com/documents/20125/40024/Fundraising_Que_Es_746x419.jpg.png/1d5821d7-f7b9-5d4c-be73-7b6d8522ca18?t=1700550627778'),
-- Food Bank
(2, 'Food Distribution', 'Distribute food to families in need.', '1 Tampines Walk, Our Tampines Hub', 'East', '2025-04-05', '14:00', '18:00', 16, 40, 20, 'https://foodbanknews.org/wp-content/uploads/2023/04/DSC_8539_0.jpg'),
(2, 'Warehouse Sorting', 'Sort food donations at our warehouse.', '18 Bedok North St 5, Bedok Industrial Park', 'East', '2025-07-10', '11:00', '15:00', 16, 25, 18, 'https://assets.warehousegig.com/production/288/Warehouse_Sorter_Job_Description_1600x684.png'),
(2, 'Community Kitchen', 'Prepare meals for the underprivileged.', '200 Sims Ave, Geylang', 'East', '2025-10-25', '08:00', '12:00', 21, 35, 28, 'https://images.squarespace-cdn.com/content/v1/575c7d10044262e4c49720f7/091ffeb5-e6b7-473e-834c-857b0dcb168b/community-kitchen.jpg'),
-- Literacy Program
(3, 'Reading Session', 'Conduct reading sessions for children.', '298 Yishun St 20, Northpoint City', 'North', '2025-02-28', '16:00', '18:00', 17, 20, 12, 'https://blog.hope-education.co.uk/wp-content/uploads/2021/02/children_guided_reading.jpg'),
(3, 'Book Donation Drive', 'Organize a book donation event.', '3 Bukit Panjang Ring Rd, Hillion Mall', 'West', '2025-05-22', '10:00', '14:00', 21, 60, 40, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz8kV5ftFg1rXDGefqswhgK8EvAZoLpBxCAw&s'),
(3, 'Tutoring Program', 'Provide tutoring for underprivileged children.', '31 Jurong West Central 3, Jurong Point', 'West', '2025-08-15', '17:00', '20:00', 18, 30, 25, 'https://blog.sagaeducation.org/hubfs/Imported_Blog_Media/tutor-1.jpg'),
-- Environmental Cleanup
(4, 'Beach Cleanup', 'Join us in cleaning up East Coast Park.', 'East Coast Park, Marine Parade', 'East', '2025-03-22', '07:00', '12:00', 16, 100, 60, 'https://a.storyblok.com/f/146790/1600x842/7ac33a43f1/how-to-organize-a-beach-clean-up-0.png'),
(4, 'Park Maintenance', 'Help maintain the greenery at Bishan Park.', '1384 Ang Mo Kio Ave 1, Bishan Park', 'Central', '2025-06-18', '09:00', '13:00', 16, 50, 30, 'https://www.gofmx.com/wp-content/uploads/2023/08/Park-maintenance-groundskeeper-1024x683.jpg'),
(4, 'Community Garden', 'Assist in managing a community garden.', 'Bukit Batok Nature Park', 'West', '2025-09-10', '08:00', '12:00', 21, 40, 25, 'https://cdn.hosted-assets.com/nourishingneighbors/ul/q_auto/9DEY071R/c89e77/c89e77-iStock-1364679535.jpg'),
-- Soup Kitchen
(5, 'Soup Kitchen Service', 'Serve meals to the homeless.', '27 Kreta Ayer Rd, Chinatown', 'Central', '2025-01-10', '11:00', '14:00', 18, 45, 30, 'https://static1.straitstimes.com.sg/s3fs-public/styles/large30x20/public/articles/2022/05/12/mi_edwintong_120522.jpg?VersionId=MfQ776gQhwGqvI1XR.P25kjYBeT1ose4'),
(5, 'Meal Preparation', 'Prepare meals for distribution.', 'Blk 531A Upper Cross St, Hong Lim Complex', 'Central', '2025-07-05', '06:00', '10:00', 21, 30, 18, 'https://images.everydayhealth.com/images/diet-nutrition/benefits-of-meal-planning-alt-1440x810.jpg'),
(5, 'Volunteer Training', 'Train new volunteers at the soup kitchen.', '10 Sinaran Dr, Novena', 'Central', '2025-11-22', '09:00', '12:00', 26, 25, 15, 'https://volunteerhub.com/hubfs/Imported_Blog_Media/4-Easy-to-Implement-Volunteer-Training-Tips.jpg');


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
INSERT INTO Admins (adminname, adminpasswordHash)
VALUES 
('Jessica Liu', '$2b$10$0.sMPsIOuiu..COINhvFSOsyjPdO1IBPeun4fDxgas/3bIkjLxmmG'), /*password123!*/
('Michael Tan', '$2b$10$Ag6/NPfClRUiHzGxZV9PZuyv8xswo4NB2AsK5rpwqLf2o69H1MHDC'), /*securePass45#*/
('Samantha Lee', '$2b$10$a7zrez37rpNx8Tti4wf2xOlsVz8H93DEn9iPaSkbhV70dyUMizvgu'); /*admin!Pass78*/

INSERT INTO Messages (volunteerid, ngoid, content, timestamp)
VALUES
    (1, 1, 'Hello from volunteer 1 to NGO 1', GETDATE()),
    (2, 2, 'Urgent request from volunteer 2 to NGO 2', GETDATE()),
    (3, 1, 'Inquiry about volunteer opportunities', GETDATE()),
    (4, 4, 'Volunteer 4 needs assistance from NGO 4', GETDATE()),
    (5, 2, 'Thank you for the support, NGO 2', GETDATE()),
    (1, 1, 'Update on project progress', GETDATE()),
    (2, 4, 'Request for additional resources', GETDATE());




