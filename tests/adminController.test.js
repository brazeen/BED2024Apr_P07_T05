

const admincontroller = require("../controllers/admincontroller");
const Admin = require("../models/admin");


jest.mock("../models/admin"); 

describe("admincontroller.getAdminByUsername", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch the admin with the username and return a JSON response", async () => {
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

    Admin.getAdminByUsername.mockResolvedValue(mockAdmin[0]);

    const req = {params: {name: "John Tan"}  };
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await admincontroller.getAdminByUsername(req, res);

    expect(res.json).toHaveBeenCalledWith(mockAdmin[0]); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Admin.getAdminByUsername.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = { params: {name: "hiii"} };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await admincontroller.getAdminByUsername(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving admin");
  });
});