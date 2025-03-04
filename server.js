const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const fs = require('fs');

const BOOKS_FILE = 'books.txt';

// POST route to add a book
app.post('/add-book', (req, res) => {
    const { bookName, isbn, author, yearPublished } = req.body;

    if (!bookName || !isbn || !author || !yearPublished) {
        return res.json({ success: false, message: "All fields are required." });
    }

    const bookEntry = `${bookName},${isbn},${author},${yearPublished}\n`;

    fs.appendFile(BOOKS_FILE, bookEntry, (err) => {
        if (err) {
            return res.json({ success: false, message: "Error saving book." });
        }
        res.json({ success: true });
    });
});

// GET route to find a book by ISBN and Author
app.get('/find-by-isbn-author', (req, res) => {
    const { isbn, author } = req.query;

    if (!isbn || !author) {
        return res.json({ success: false, message: "ISBN and Author are required." });
    }

    fs.readFile(BOOKS_FILE, 'utf8', (err, data) => {
        if (err) return res.json({ success: false });

        const books = data.split('\n').filter(line => line);
        const foundBook = books.find(book => {
            const [bookName, bookIsbn, bookAuthor, year] = book.split(',');
            return bookIsbn === isbn && bookAuthor === author;
        });

        if (foundBook) {
            res.json({ success: true, book: foundBook });
        } else {
            res.json({ success: false, message: "Book not found." });
        }
    });
});



// GET route to find books by Author
app.get('/find-by-author', (req, res) => {
    const { author } = req.query;

    if (!author) {
        return res.json({ success: false, message: "Author is required." });
    }

    fs.readFile(BOOKS_FILE, 'utf8', (err, data) => {
        if (err) return res.json({ success: false });

        const books = data.split('\n').filter(line => line);
        const foundBooks = books.filter(book => {
            const [bookName, bookIsbn, bookAuthor, year] = book.split(',');
            return bookAuthor === author;
        });

        if (foundBooks.length > 0) {
            res.json({ success: true, books: foundBooks });
        } else {
            res.json({ success: false, message: "No books found for this author." });
        }
    });
});
