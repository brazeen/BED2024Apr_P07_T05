

const applicationcontroller = require("../controllers/applicationcontroller");
const Application = require("../models/application");


jest.mock("../models/application"); 

describe("applicationcontroller.getApplicationById", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch the application by its id and return a JSON response", async () => {
    const mockApplications = [
        {
          applicationid: 1,
          volunteerid: 1,
          opportunityid: 1,
          status: 'A'
        },
        {
          applicationid: 2,
          volunteerid: 2,
          opportunityid: 2,
          status: 'P'
        },
      ];
    Application.getApplicationById.mockResolvedValue(mockApplications[0]);

    const req = {params: {id: 1}  };
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await applicationcontroller.getApplicationById(req, res);

    expect(res.json).toHaveBeenCalledWith(mockApplications[0]); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Application.getApplicationById.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = { params: {id: 22} };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await applicationcontroller.getApplicationById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving application");
  });
});

describe("applicationcontroller.getApplicationByVolunteerId", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock calls before each test
    });
  
    it("should fetch the application by its volunteerid and return a JSON response", async () => {
        const mockApplications = [
            {
              applicationid: 1,
              volunteerid: 1,
              opportunityid: 1,
              status: 'A'
            },
            {
              applicationid: 2,
              volunteerid: 2,
              opportunityid: 2,
              status: 'P'
            },
          ];
      Application.getApplicationByVolunteerId.mockResolvedValue(mockApplications[1]);
  
      const req = {params: {id: 2}  };
      const res = {
        json: jest.fn(), // Mock the res.json function
      };
  
      await applicationcontroller.getApplicationByVolunteerId(req, res);
  
      expect(res.json).toHaveBeenCalledWith(mockApplications[1]); // Check the response body
    });
  
    it("should handle errors and return a 500 status with error message", async () => {
      const errorMessage = "Database error";
      Application.getApplicationByVolunteerId.mockRejectedValue(new Error(errorMessage)); // Simulate an error
  
      const req = { params: {id: 22} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await applicationcontroller.getApplicationByVolunteerId(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving application");
    });
  });

describe("applicationcontroller.getApplicationByVolunteerAndOpportunityId", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mock calls before each test
    });

    it("should fetch the application by its volunteerid and opportunityid and return a JSON response", async () => {
        const mockApplications = [
            {
                applicationid: 1,
                volunteerid: 1,
                opportunityid: 1,
                status: 'A'
            },
            {
                applicationid: 2,
                volunteerid: 2,
                opportunityid: 2,
                status: 'P'
            },
            {
                applicationid: 3,
                volunteerid: 3,
                opportunityid: 2,
                status: 'P'
            },
            ];
        Application.getApplicationByVolunteerAndOpportunityId.mockResolvedValue(mockApplications[2]);

        const req = {params: {volunteerid: 3, opportunityid: 2}  };
        const res = {
        json: jest.fn(), // Mock the res.json function
        };

        await applicationcontroller.getApplicationByVolunteerAndOpportunityId(req, res);

        expect(res.json).toHaveBeenCalledWith(mockApplications[2]); // Check the response body
    });

    it("should handle errors and return a 500 status with error message", async () => {
        const errorMessage = "Database error";
        Application.getApplicationByVolunteerAndOpportunityId.mockRejectedValue(new Error(errorMessage)); // Simulate an error

        const req = { params: {volunteerid: 22, opportunityid: 44} };
        const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        };

        await applicationcontroller.getApplicationByVolunteerAndOpportunityId(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error retrieving application");
    });
});

describe("applicationcontroller.getApplicationByOpportunityAndStatus", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mock calls before each test
    });

    it("should fetch the application by its opportunityid and status and return a JSON response", async () => {
        const mockApplications = [
            {
                applicationid: 1,
                volunteerid: 1,
                opportunityid: 1,
                status: 'A'
            },
            {
                applicationid: 2,
                volunteerid: 2,
                opportunityid: 2,
                status: 'A'
            },
            {
                applicationid: 3,
                volunteerid: 3,
                opportunityid: 2,
                status: 'P'
            },
            ];
        Application.getApplicationsByOpportunityandStatus.mockResolvedValue(mockApplications[2]);

        const req = {params: {status: 'P', opportunityid: 2}  };
        const res = {
        json: jest.fn(), // Mock the res.json function
        };

        await applicationcontroller.getApplicationsByOpportunityandStatus(req, res);

        expect(res.json).toHaveBeenCalledWith(mockApplications[2]); // Check the response body
    });

    it("should handle errors and return a 500 status with error message", async () => {
        const errorMessage = "Database error";
        Application.getApplicationsByOpportunityandStatus.mockRejectedValue(new Error(errorMessage)); // Simulate an error

        const req = { params: {opportunityid: 44, status: 'A'} };
        const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        };

        await applicationcontroller.getApplicationsByOpportunityandStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error retrieving application");
    });
});