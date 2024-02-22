require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Body parser integrated with Express

const db = mysql.createPool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  connectionLimit: 100,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Vérification de la connexion à la base de données au démarrage du serveur
db.getConnection((error, connection) => {
  if (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1); // Exit the process if unable to connect to database
  }
  console.log("Connection to database successful");
  connection.release(); // Release the connection
});

// Route pour la page d'accueil
app.get("/", (req, res) => {
  res.send("Hello Everyone");
});

// Route pour gérer les messages de contact
app.post("/contact", (req, res) => {
  let adress = req.body.adress;
  let message = req.body.message;
  
  // Requête SQL pour insérer les données de contact dans la base de données
  let qr = `INSERT INTO user (adress, message) VALUES (?, ?)`;
  
  // Exécution de la requête SQL
  db.query(qr, [adress, message], (error, results) => {
    if (error) {
      console.error("SQL query execution error:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
    // Vérification si des lignes ont été affectées par la requête
    if (results.affectedRows > 0) {
      return res.status(200).send({ message: "Message sent successfully" });
    } else {
      return res.status(500).send({ message: "Failed to send message" });
    }
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
