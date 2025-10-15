const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const dataFile = path.join(__dirname, "data", "recipes.json");

// --- Helper: Read recipes from file ---
const getRecipes = () => {
  try {
    const data = fs.readFileSync(dataFile, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading recipes.json:", err);
    return [];
  }
};

// --- Helper: Save recipes to file ---
const saveRecipes = (recipes) => {
  fs.writeFileSync(dataFile, JSON.stringify(recipes, null, 2));
};

// --- Task 1: Add a new recipe (POST) ---
app.post("/api/recipes", (req, res) => {
  const { title, ingredients, instructions, cookTime, difficulty } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ error: "Title, ingredients, and instructions are required." });
  }

  const newRecipe = {
    id: Date.now(),
    title,
    ingredients,
    instructions,
    cookTime: cookTime || "N/A",
    difficulty: difficulty || "medium",
  };

  const recipes = getRecipes();
  recipes.push(newRecipe);
  saveRecipes(recipes);

  res.status(201).json(newRecipe);
});

// --- Task 2: Get all recipes (GET) ---
app.get("/api/recipes", (req, res) => {
  try {
    const recipes = getRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Could not read recipes.json" });
  }
});

// --- Default Route ---
app.get("/", (req, res) => {
  res.send("🍳 Recipe API is running successfully!");
});

// --- Server Port ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port http://localhost:${PORT}`);
});
