const express = require("express");
const app = express();
const PORT = 3000;
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
var jwt = require('jsonwebtoken');

app.use(express.json());

/**
 * ============================================
 * 
 * DATABASE CONNECTION
 * 
 * ============================================
 */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test_db_api",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

/**
 * ============================================
 * 
 * MIDDLEWARE
 * 
 * ============================================
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: true,
      message: "Access token required",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || "shhhhh", (err, user) => {
    if (err) {
      return res.status(403).json({
        error: true,
        message: "Invalid or expired token",
      });
    }

    req.user = user;
    next();
  });
}

/**
 * ============================================
 *
 * API ENDPOINT
 *
 * ============================================
 */

/**
 *
 * API PING
 */
app.get("/", (req, res) => {
  res.json({ message: "Ping!" });
});

/**
 *
 * API REGISTER
 */
app.post("/register", (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: true,
        message: "Missing required fields: name, email, or password",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: true,
        message: "must be at least 8 characters",
      });
    }

    const passwordHash = bcrypt.hashSync(password, salt);
    const sql = "INSERT INTO users (name, email, password) VALUES (?,?,?)";
  
    db.query(sql, [name, email, passwordHash], (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            error: true,
            message: "Email already in use",
          });
        }

        return res.status(500).json({
          error: true,
          message: "Failed to create user",
        });
      }
  
      res.status(201).json({
        error: false,
        message: "User created"
      });
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal server error",
    })
  }
});

/**
 * 
 * API LOGIN
 */
app.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Email and password are required",
      });
    }

    const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";

    db.query(sql, [email], (err, result) => {
      if (err) {
        return res.status(400).json({
          error: true,
          message: "Failed to login user",
        });
      }

      if (!result[0]) {
        return res.status(401).json({
          error: true,
          message: "Invalid email or password",
        });
      }

      const user = result[0];
      const passwordVerified = bcrypt.compareSync(password, user.password);

      if (!passwordVerified) {
        return res.status(401).json({
          error: true,
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign({ 
        id: user.id, 
        name: user.name, 
        email: user.email 
      }, process.env.JWT_SECRET || 'shhhhh', { expiresIn: '1h' });

      const sqlSaveToken = "UPDATE users SET token = ? WHERE id = ?";

      db.query(sqlSaveToken, [token, user.id], (err) => {
        if (err) {
          return res.status(400).json({
            error: true,
            message: "Failed to save token",
          });
        }

        res.status(200).json({
          error: false,
          message: "Success",
          loginResult: {
            userId: user.id,
            name: user.name,
            token
          },
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

/**
 * ============================================
 * 
 * SERVER RUNNING
 * 
 * ============================================
 */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api`);
});