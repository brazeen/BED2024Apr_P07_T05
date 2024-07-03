-- Drop Tables if they exist
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Books;




CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(255) UNIQUE,
    passwordHash VARCHAR(255),
    role VARCHAR(20) CHECK (role IN ('member', 'librarian'))
);

CREATE TABLE Books (
    book_id INT PRIMARY KEY IDENTITY(1,1),
    title VARCHAR(255),
    author VARCHAR(255),
    availability CHAR(1) CHECK (availability IN ('Y', 'N'))
);

INSERT INTO Books (title, author, availability)
VALUES
  ('The Chronicles of Narnia: The Lion, the Witch, and the Wardrobe', 'C.S. Lewis', 'Y'),
  ('Pride and Prejudice', 'Jane Austen', 'Y'),
  ('The Lord of the Rings: The Fellowship of the Ring', 'J.R.R. Tolkien', 'N'),
  ('To Kill a Mockingbird', 'Harper Lee', 'Y'),
  ('1984', 'George Orwell', 'N'),
  ('The Catcher in the Rye', 'J.D. Salinger', 'Y'),
  ('The Great Gatsby', 'F. Scott Fitzgerald', 'Y'),
  ('The Adventures of Huckleberry Finn', 'Mark Twain', 'N'),
  ('Animal Farm', 'George Orwell', 'Y');
