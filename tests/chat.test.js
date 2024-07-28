const Admin = require("../models/admin");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Application.getApplicationById", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should retrieve an chat id and name by their Id", async () => {
      const mockApplications = [
        {
          applicationid: 1,
          volunteerid: 1,
        },
        {
          applicationid: 2,
          volunteerid: 2,
          opportunityid: 2,
          status: 'P'
        },
      ];
  
      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: mockApplications }),
        input: jest.fn().mockResolvedValue(undefined),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection
  
      const application = await Application.getApplicationById(1)
      
      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(application).toBeInstanceOf(Application);
      expect(application.applicationid).toBe(1);
      expect(application.volunteerid).toBe(1);
      expect(application.opportunityid).toBe(1);
      expect(application.status).toBe('A')
    });
  
    it("should handle errors when retrieving the application", async () => {
      const errorMessage = "Database error";
      sql.connect.mockRejectedValue(new Error(errorMessage));
      await expect(Application.getApplicationById()).rejects.toThrow(errorMessage);
    });
  });