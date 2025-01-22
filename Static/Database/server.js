const express = require('express');
const mysql = require('Schema.sql');

const app = express();
const port = 5000;

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mydatabase'
});

// Connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.message);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

// Route de test
app.get('/', (req, res) => {
  res.send('API est fonctionnelle !');
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur API démarré sur le port ${port}`);
});
