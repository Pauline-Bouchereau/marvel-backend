const express = require("express");
const router = express.Router();
const axios = require("axios");

// Route to get all comics
router.get("/comics", async (req, res) => {
  try {
    let response;
    if (req.query.title) {
      response = await axios.get(
        `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}&skip=${req.query.skip}&title=${req.query.title}`
      );
    } else {
      response = await axios.get(
        `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}&skip=${req.query.skip}`
      );
    }

    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to get comics containing a specific character
router.get("/comics/:characterId", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.characterId}?apiKey=${process.env.MARVEL_API_KEY}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to get a specific comic with its ID

router.get("/comic/:comicId", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comic/${req.params.comicId}?apiKey=${process.env.MARVEL_API_KEY}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Export the routes
module.exports = router;
