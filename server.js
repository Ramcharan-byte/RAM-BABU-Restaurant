const express = require("express");
const mysql = require("mysql2");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");

const app = express();
// ======================
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.use(
    session({
        secret: "rambabu_secret_key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

// ======================
// MySQL Connection
// ======================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "rambabu_restaurant"
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed");
        console.log(err);
        return;
    }

    console.log("Connected to MySQL Database");
});

// ======================
// Routes
// ======================

// Home
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Login Page
app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

// Signup Page
app.get("/signup.html", (req, res) => {
    res.sendFile(path.join(__dirname, "signup.html"));
});

// ======================
// Signup
// ======================
app.post("/signup", async (req, res) => {

    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.json({
            success: false,
            message: "Please fill all fields."
        });
    }

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, result) => {

            if (err) {
                return res.json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (result.length > 0) {
                return res.json({
                    success: false,
                    message: "Email already exists"
                });
            }

            const hash = await bcrypt.hash(password, 10);

            db.query(
                "INSERT INTO users(fullname,email,password) VALUES(?,?,?)",
                [fullname, email, hash],
                (err) => {

                    if (err) {
                        return res.json({
                            success: false,
                            message: "Signup Failed"
                        });
                    }

                    res.json({
                        success: true,
                        message: "Signup Successful"
                    });

                }
            );

        }
    );

});

// ======================
// Login
// ======================
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, result) => {

            if (err) {
                return res.json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (result.length === 0) {
                return res.json({
                    success: false,
                    message: "User not found"
                });
            }

            const user = result[0];

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.json({
                    success: false,
                    message: "Wrong Password"
                });
            }

            req.session.user = {
                id: user.id,
                fullname: user.fullname,
                email: user.email
            };

            res.json({
                success: true,
                message: "Login Successful"
            });

        }
    );

});

// ======================
// Check Login
// ======================
app.get("/check-login", (req, res) => {

    if (req.session.user) {

        res.json({
            loggedIn: true,
            user: req.session.user
        });

    } else {

        res.json({
            loggedIn: false
        });

    }

});

// ======================
// Logout
// ======================
app.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.json({
            success: true
        });

    });

});

// ======================
// Test Route
// ======================
app.get("/test", (req, res) => {
    res.send("SERVER WORKING");
});

// ======================
// Start Server
// ======================
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
