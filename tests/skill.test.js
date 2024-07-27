const Skill = require ("../models/skill");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Skill.getAllSkills", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should retrieve all skills", async () => {
      const mockSkills = [
        {
          skillid: 1,
          skillname: 'Communication'
        },
        {
          skillid: 2,
          skillname: 'Teamwork'
        },
      ];
  
      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: mockSkills }),
        input: jest.fn().mockResolvedValue(undefined),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection
  
      const skill = await Skill.getAllSkills()
      
      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(skill).toHaveLength(2);
      expect(skill[0]).toBeInstanceOf(Skill);
      expect(skill[0].skillid).toBe(1);
      expect(skill[0].skillname).toBe('Communication');
    });
  
    it("should handle errors when retrieving the application", async () => {
      const errorMessage = "Database error";
      sql.connect.mockRejectedValue(new Error(errorMessage));
      await expect(Skill.getAllSkills()).rejects.toThrow(errorMessage);
    });
  });
  
  describe("Skill.getOpportunitySkillsById", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
    
      it("should retrieve opportunity skills by their opportunity id", async () => {
        const mockSkills = [
          {
            id: 1,
            skillid: 1,
            opportunityid: 1,
          },
          {
            id: 2,
            skillid: 2,
            opportunityid: 2,
          },
        ];
    
        const mockRequest = {
          query: jest.fn().mockResolvedValue({ recordset: [mockSkills[1]] }),
          input: jest.fn().mockResolvedValue(undefined),
        };
        const mockConnection = {
          request: jest.fn().mockReturnValue(mockRequest),
          close: jest.fn().mockResolvedValue(undefined),
        };
    
        sql.connect.mockResolvedValue(mockConnection); // Return the mock connection
    
        const skill = await Skill.getOpportunitySkillsById(2)
  
        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(skill[0]).toBeInstanceOf(Skill);
        expect(skill[0].id).toBe(1);
        expect(skill[0].skillid).toBe(1);
        expect(skill[0].opportunityid).toBe(1);
      });
    
      it("should handle errors when retrieving the opportunity skills", async () => {
        const errorMessage = "Database error";
        sql.connect.mockRejectedValue(new Error(errorMessage));
        await expect(Skill.getOpportunitySkillsById(3)).rejects.toThrow(errorMessage);
      });
    });