const express = require("express");
const router = express.Router();
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");

const User = require("../models/User");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/user/signup", async (req, res) => {
  try {
    const { username, email, password } = req.fields;

    // Check if all parameters provided
    if (email && username && password) {
      //Check if email already exists in DB
      const emailToCheck = await User.findOne({ email: email });

      if (!emailToCheck) {
        // Check if username is available
        const usernameToCheck = await User.findOne({ username: username });

        if (!usernameToCheck) {
          // Generate a salt
          const salt = uid2(16);
          // Generate an hash
          const hash = SHA256(salt + password).toString(encBase64);
          // Generate a token
          const token = uid2(64);
          // Create a new user in DB
          const newUser = new User({
            email: email,
            username: username,
            token: token,
            hash: hash,
            salt: salt,
          });
          // Save new User
          await newUser.save();
          // Respond to client
          res.status(200).json({
            _id: newUser._id,
            token: newUser.token,
            username: newUser.username,
            email: newUser.email,
          });
        } else {
          res.status(409).json({ message: "This username is not available" });
        }
      } else {
        res
          .status(409)
          .json({ message: "There already is an account with this email." });
      }
    } else {
      res.status(400).json({ message: "Missing Parameter" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.fields;

    if (email && password) {
      const user = await User.findOne({ email: email });

      if (user) {
        const newHash = SHA256(user.salt + password).toString(encBase64);

        if (newHash === user.hash) {
          res
            .status(200)
            .json({ _id: user.id, token: user.token, username: user.username });
        } else {
          res.status(401).json({ message: "Unauthorized" });
        }
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      res.status(400).json({ message: "Missing parameters." });
    }
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

// Route to update comic favorite list
router.put(
  "/user/favoritecomiclist/update/:id",
  isAuthenticated,
  async (req, res) => {
    try {
      // Find user thanks to ID in params
      const user = await User.findById(req.params.id);
      // Update their comics favorite lists
      user.favoriteListComics = req.fields.favoriteListComics.split("**");
      // Save changes
      await user.save();
      // Respond to client
      res.status(200).json({ message: "Comics Favorite List updated" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Route to update character favorite list

router.put(
  "/user/favoritecharacterlist/update/:id",
  isAuthenticated,
  async (req, res) => {
    try {
      // Find user thanks to ID in params
      const user = await User.findById(req.params.id);
      // Update their comics favorite lists
      user.favoriteListCharacter =
        req.fields.favoriteListCharacters.split("**");
      // Save changes
      await user.save();
      // Respond to client
      res.status(200).json({ message: "Characters Favorite List updated" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Route to read comic and character favorite list

router.get("/user/favoritelists/:id", isAuthenticated, async (req, res) => {
  try {
    // Find user thanks to ID in params
    const user = await User.findById(req.params.id);
    // Respond to the client with favorite lists
    res.status(200).json({
      favoriteListCharacter: user.favoriteListCharacter,
      favoriteListComics: user.favoriteListComics,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Export routes
module.exports = router;
