const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the "frontend" folder
app.use(express.static(path.join(__dirname, 'frontend')));

// File to store cocktail data
const DATA_FILE = path.join(__dirname, 'data.json');

// Function to read data from the JSON file
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    // If file doesn't exist, return an empty array
    return [];
  }
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Function to write data to the JSON file
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Load cocktails data from the JSON file
let cocktails = readData();

// Get all cocktails
app.get('/api/cocktails', (req, res) => {
  res.json(cocktails);
});

// Get a cocktail by ID
app.get('/api/cocktails/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const cocktail = cocktails.find(c => c.id === id);
  if (!cocktail) {
    return res.status(404).json({ message: "Cocktail not found" });
  }
  res.json(cocktail);
});

// Add a new cocktail
app.post('/api/cocktails', (req, res) => {
  const { name, img, ingredients, description } = req.body;
  if (!name || !img || !ingredients || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const newCocktail = {
    id: cocktails.length > 0 ? cocktails[cocktails.length - 1].id + 1 : 1,
    name,
    img,
    ingredients,
    like: 0,
    dislike: 0,
    description
  };
  cocktails.push(newCocktail);
  writeData(cocktails); // Save to JSON file
  res.status(201).json(newCocktail);
});

// Update likes/dislikes for a cocktail
app.patch('/api/cocktails/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const cocktail = cocktails.find(c => c.id === id);
  if (!cocktail) {
    return res.status(404).json({ message: "Cocktail not found" });
  }

  const { like, dislike } = req.body;
  if (like !== undefined) cocktail.like = like;
  if (dislike !== undefined) cocktail.dislike = dislike;

  writeData(cocktails); // Save to JSON file
  res.json(cocktail);
});

// Delete a cocktail
app.delete('/api/cocktails/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = cocktails.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Cocktail not found" });
  }
  cocktails.splice(index, 1);
  writeData(cocktails); // Save to JSON file
  res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});