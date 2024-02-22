require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 

const db = mysql.createPool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  connectionLimit: 100,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.getConnection((error, connection) => {
  if (error) {
    console.error("Failed to connect to database:", error);
  }
  console.log("Connection to database successful");
  connection.release(); 
});

app.get("/", (req, res) => {
  res.send("Hello Everyone");
});

// Contact
app.post("/contact", (req, res, next) => {
  let adress = req.body.adress;
  let message = req.body.message;
  
  let qr = `INSERT INTO contact (adress, message) VALUES (?, ?)`;
  
  db.query(qr, [adress, message], (error, results) => {
    if (error) {
      console.error("SQL query execution error:", error);
      return next(error); 
    }
    if (results.affectedRows > 0) {
      return res.status(200).send({ message: "Message sent successfully" });
    } else {
      return res.status(500).send({ message: "Failed to send message" });
    }
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
