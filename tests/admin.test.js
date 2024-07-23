
const Admin = require("../models/admin");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Admin.getAdminByUsername", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve an admin by their username", async () => {
    const mockAdmin = [
      {
        adminid: 1,
        adminname: "John Tan",
        adminpasswordHash: "testhash"
      },
      {
        adminid: 2,
        adminname: "Grayson Loh",
        adminpasswordHash: "testhashtwo"
      },
    ];

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockAdmin }),
      input: jest.fn().mockResolvedValue(undefined),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const admin = await Admin.getAdminByUsername("John Tan")
    
    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(admin).toBeInstanceOf(Admin);
    expect(admin.adminid).toBe(1);
    expect(admin.adminname).toBe("John Tan");
    expect(admin.adminpasswordHash).toBe("testhash");
  });

  it("should handle errors when retrieving the admin", async () => {
    const errorMessage = "Database error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Admin.getAdminByUsername()).rejects.toThrow(errorMessage);
  });
});
