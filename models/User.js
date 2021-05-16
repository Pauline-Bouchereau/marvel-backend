const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: {
    unique: true,
    type: String,
    required: true,
  },
  email: {
    unique: true,
    type: String,
    required: true,
  },
  favoriteListCharacter: Array,
  favoriteListComics: Array,
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
