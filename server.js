const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: 'Adityam@0093', // Your MySQL password
    database: 'app'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1);
    }
    console.log('MySQL Connected...');
});

// Signup Route
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const sql = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).json({ message: 'Error saving user to database.' });
        }
        res.status(200).json({ message: 'User registered successfully.' });
    });
});

// Signin Route
app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Both email and password are required.' });
    }

    const sql = 'SELECT * FROM user WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Error querying data:', err.message);
            return res.status(500).json({ message: 'Error during login.' });
        }

        if (results.length > 0) {
            res.status(200).json({ message: 'Login successful.' });
        } else {
            res.status(401).json({ message: 'Invalid credentials.' });
        }
    });
});

// Start Server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
