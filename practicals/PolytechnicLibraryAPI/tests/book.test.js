// book.test.js
const Book = require("../models/book");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Book.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all books from the database", async () => {
    const mockBooks = [
      {
        book_id: 1,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        availability: "Y",
      },
      {
        book_id: 2,
        title: "The Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        availability: "N",
      },
    ];

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockBooks }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const books = await Book.getAllBooks();
    
    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(books).toHaveLength(2);
    expect(books[0]).toBeInstanceOf(Book);
    expect(books[0].book_id).toBe(1);
    expect(books[0].title).toBe("The Lord of the Rings");
    expect(books[0].author).toBe("J.R.R. Tolkien");
    expect(books[0].availability).toBe("Y");
    // ... Add assertions for the second book
  });

  it("should handle errors when retrieving books", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.getAllBooks()).rejects.toThrow(errorMessage);
  });
});

// book.test.js (continue in the same file)
describe("Book.updateBookAvailability", () => {
    // ... mock mssql and other necessary components
    beforeEach(() => {
        jest.clearAllMocks();
      });
  
    it("should update the availability of a book", async () => {
      const mockBooks = [
        {
          book_id: 1,
          title: "The Lord of the Rings",
          author: "J.R.R. Tolkien",
          availability: "Y",
        }
      ];

      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: mockBooks }),
        input: jest.fn().mockResolvedValue(undefined),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      const books = await Book.updateBookAvailability(1, 'N');
    
      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockConnection.close).toHaveBeenCalledTimes(2);
      expect(books).toBeInstanceOf(Book);
      expect(books.title).toBe("The Lord of the Rings");
      expect(books.author).toBe("J.R.R. Tolkien");
      
    });
  
    it("should return null if book with the given id does not exist", async () => {

      const mockRequest = {
        query: jest.fn().mockResolvedValue({ recordset: [] }),
        input: jest.fn().mockResolvedValue(undefined),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };

      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

      const books = await Book.updateBookAvailability(3, 'N');

      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockConnection.close).toHaveBeenCalledTimes(2);

      expect(books).toBeNull()
    });
  
    // Add more tests for error scenarios (e.g., database error)
  });
