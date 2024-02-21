require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  connectionLimit: 100,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.getConnection((error) => {
  if (!error) {
    console.log("Connection to database successful");
  } else {
    console.log("Failed to connect to database:", error);
  }
});

app.get("/", (req, res) => {
    res.send("Hello Everyone");
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

// MESSAGE
app.post("/contact", (req, res) => {
  const { adress, message } = req.body;
  const qr = "INSERT INTO contact (adress, message) VALUES (?, ?)";

  db.query(qr, [adress, message], (error, results) => {
    if (error) {
      console.error(
        "Erreur lors de l'exécution de la requête SQL :",
        error.message
      );
      res.status(500).send({ message: "Erreur d'interval serveur" });
    } else if (results.affectedRows > 0) {
      res.status(200).send({ message: "Message envoyé avec succès" });
    } else {
      res.status(500).send({ message: "Erreur de l'envoi du message" });
    }
  });
});