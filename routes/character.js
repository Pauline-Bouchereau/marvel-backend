// Import necessary packages and middlewares
const express = require("express");
const axios = require("axios");
const router = express.Router();

// Route to get all characters
router.get("/characters", async (req, res) => {
  try {
    response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_KEY}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Export the routes
module.exports = router;
