const express = require('express');
const router = express.Router();
const likedSongsController = require('../controllers/likedSongController.js');
const authenticateUser = require('../middleware/authMiddleware.js');
const {
  validateLikeSong,
} = require("../middleware/validation/likedSongsValidation");

const {
  validateObjectIdParam,
} = require("../middleware/validation/paramValidation");

const { validationResult } = require("express-validator");


// Liked songs routes

// Get all liked songs of a user by user id
router.get("/users/:id/liked",
    authenticateUser, 
    validateObjectIdParam("id"),
    likedSongsController.getLikedSongs
);

// Like or unlike a song by song id
router.post(
  "/users/:id/like",
  authenticateUser,
  validateObjectIdParam("id"),
  validateLikeSong,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  likedSongsController.likeSong
);

// Unlike a song by song id
router.delete(
  "/users/:id/unlike",
  authenticateUser,
  validateObjectIdParam("id"),
  validateLikeSong,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  likedSongsController.unlikeSong
);

module.exports = router;