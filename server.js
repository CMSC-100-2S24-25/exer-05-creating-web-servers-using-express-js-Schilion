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
