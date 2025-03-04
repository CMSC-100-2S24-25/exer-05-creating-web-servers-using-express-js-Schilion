// Import necessary modules
const express = require('express'); // Express framework for handling HTTP requests
const fs = require('fs'); // File system module to read and write files

// Initialize Express app
const app = express();
const port = 3000; // Define the server port

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define the file where books will be stored
const BOOKS_FILE = 'books.txt';

/**
 * 📌 **POST /add-book**
 * Adds a new book to the `books.txt` file.
 *
 * Expected request body (JSON):
 * {
 *   "bookName": "Harry Potter",
 *   "isbn": "123456789",
 *   "author": "J.K. Rowling",
 *   "yearPublished": "1997"
 * }
 *
 * Response:
 * - `{ "success": true }` if the book is successfully saved
 * - `{ "success": false, "message": "Error message" }` if something goes wrong
 */
app.post('/add-book', (req, res) => {
    const { bookName, isbn, author, yearPublished } = req.body;

    // Validate input: Ensure all required fields are provided
    if (!bookName || !isbn || !author || !yearPublished) {
        return res.json({ success: false, message: "All fields (bookName, ISBN, author, yearPublished) are required." });
    }

    // Format the book entry as a single line in the text file
    const bookEntry = `${bookName},${isbn},${author},${yearPublished}\n`;

    // Append the book entry to `books.txt`
    fs.appendFile(BOOKS_FILE, bookEntry, (err) => {
        if (err) {
            return res.json({ success: false, message: "Error saving book." });
        }
        res.json({ success: true });
    });
});

/**
 * 📌 **GET /find-by-isbn-author**
 * Retrieves a book using both ISBN and Author as search parameters.
 *
 * Example request:
 * `GET /find-by-isbn-author?isbn=123456789&author=J.K. Rowling`
 *
 * Response:
 * - `{ "success": true, "book": "Harry Potter,123456789,J.K. Rowling,1997" }` if found
 * - `{ "success": false, "message": "Book not found." }` if not found
 */
app.get('/find-by-isbn-author', (req, res) => {
    const { isbn, author } = req.query;

    // Validate input: Ensure both ISBN and Author are provided
    if (!isbn || !author) {
        return res.json({ success: false, message: "ISBN and Author are required." });
    }

    // Read `books.txt` file
    fs.readFile(BOOKS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.json({ success: false, message: "Error reading books database." });
        }

        // Convert file data into an array of book entries
        const books = data.split('\n').filter(line => line);
        
        // Find the book that matches both ISBN and Author
        const foundBook = books.find(book => {
            const [bookName, bookIsbn, bookAuthor, year] = book.split(',');
            return bookIsbn === isbn && bookAuthor === author;
        });

        // Return the found book or an error message
        if (foundBook) {
            res.json({ success: true, book: foundBook });
        } else {
            res.json({ success: false, message: "Book not found." });
        }
    });
});

/**
 * 📌 **GET /find-by-author**
 * Retrieves all books written by a given author.
 *
 * Example request:
 * `GET /find-by-author?author=J.K. Rowling`
 *
 * Response:
 * - `{ "success": true, "books": ["Harry Potter,123456789,J.K. Rowling,1997", ...] }` if books are found
 * - `{ "success": false, "message": "No books found for this author." }` if no books match
 */
app.get('/find-by-author', (req, res) => {
    const { author } = req.query;

    // Validate input: Ensure the author parameter is provided
    if (!author) {
        return res.json({ success: false, message: "Author is required." });
    }

    // Read `books.txt` file
    fs.readFile(BOOKS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.json({ success: false, message: "Error reading books database." });
        }

        // Convert file data into an array of book entries
        const books = data.split('\n').filter(line => line);

        // Filter books written by the requested author
        const foundBooks = books.filter(book => {
            const [bookName, bookIsbn, bookAuthor, year] = book.split(',');
            return bookAuthor === author;
        });

        // Return the list of books or an error message
        if (foundBooks.length > 0) {
            res.json({ success: true, books: foundBooks });
        } else {
            res.json({ success: false, message: "No books found for this author." });
        }
    });
});

/**
 * 📌 **Server Start**
 * Starts the Express server and listens on the defined port.
 */
app.listen(port, () => {
    console.log(`📚 Book API Server is running at http://localhost:${port}`);
});
