const skillcontroller = require("../controllers/skillcontroller");
const Skill = require ("../models/skill");

jest.mock("../models/skill");

describe("skillcontroller.getOpportunitySkillsById", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
    });
  
    it("should fetch the opportunity skills by ID and return a JSON response", async () => {
      const mockSkills = [
          {
            id: 1,
            skillid: 1,
            opportunityid: 1
          },
          {
            id: 2,
            skillid: 2,
            opportunityid: 2
          },
        ];
  
      Skill.getOpportunitySkillsById.mockResolvedValue(mockSkills[0]);
  
      const req = {params: {skillid: 2}  };
      const res = {
        json: jest.fn(), // Mock the res.json function
      };
  
      await skillcontroller.getOpportunitySkillsById(req, res);
  
      expect(res.json).toHaveBeenCalledWith(mockSkills[0]); // Check the response body
    });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      Skill.getOpportunitySkillsById.mockRejectedValue(new Error(errorMessage)); // Simulate an error
  
      const req = { params: {skillid: 200} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await skillcontroller.getOpportunitySkillsById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving Opportunity skills.");
    });
  });