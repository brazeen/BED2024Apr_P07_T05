
const Application = require("../models/application");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Application.getApplicationById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve an application by their Id", async () => {
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

describe("Application.getApplicationByVolunteerId", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should retrieve applications by their volunteerId", async () => {
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
  
      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: [mockApplications[1]] }),
        input: jest.fn().mockResolvedValue(undefined),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection
  
      const application = await Application.getApplicationByVolunteerId(2)

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(application[0]).toBeInstanceOf(Application);
      expect(application[0].applicationid).toBe(2);
      expect(application[0].volunteerid).toBe(2);
      expect(application[0].opportunityid).toBe(2);
      expect(application[0].status).toBe('P')
    });
  
    it("should handle errors when retrieving the application", async () => {
      const errorMessage = "Database error";
      sql.connect.mockRejectedValue(new Error(errorMessage));
      await expect(Application.getApplicationByVolunteerId(3)).rejects.toThrow(errorMessage);
    });
  });

describe("Application.getApplicationByVolunteerAndOpportunityId", () => {
beforeEach(() => {
    jest.clearAllMocks();
});

    it("should retrieve applications by their volunteerId and opportunityId", async () => {
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

        const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: [mockApplications[2]] }),
        input: jest.fn().mockResolvedValue(undefined),
        };
        const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
        };

        sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

        const application = await Application.getApplicationByVolunteerAndOpportunityId(3,2)

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(application).toBeInstanceOf(Application);
        expect(application.volunteerid).toBe(3);
        expect(application.opportunityid).toBe(2);
    });

    it("should handle errors when retrieving the application", async () => {
        const errorMessage = "Database error";
        sql.connect.mockRejectedValue(new Error(errorMessage));
        await expect(Application.getApplicationByVolunteerAndOpportunityId(5,5)).rejects.toThrow(errorMessage);
    });
});

describe("Application.getApplicationByOpportunityandStatus", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
        it("should retrieve applications by their opportunityId", async () => {
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
    
            const mockRequest = {
            query: jest.fn().mockResolvedValue({ recordset: [mockApplications[2]] }),
            input: jest.fn().mockResolvedValue(undefined),
            };
            const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
            };
    
            sql.connect.mockResolvedValue(mockConnection); // Return the mock connection
    
            const application = await Application.getApplicationsByOpportunityandStatus(2, 'P')
            console.log(application)
            expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
            expect(mockConnection.close).toHaveBeenCalledTimes(1);
            expect(application[0]).toBeInstanceOf(Application);
            expect(application[0].volunteerid).toBe(3);
            expect(application[0].opportunityid).toBe(2);
        });
    
        it("should handle errors when retrieving the application", async () => {
            const errorMessage = "Database error";
            sql.connect.mockRejectedValue(new Error(errorMessage));
            await expect(Application.getApplicationByVolunteerAndOpportunityId(5,5)).rejects.toThrow(errorMessage);
        });
    });
    