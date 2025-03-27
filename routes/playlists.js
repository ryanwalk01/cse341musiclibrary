const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController.js');
const authenticateUser = require('../middleware/authMiddleware.js');
const {
  validateCreatePlaylist,
} = require("../middleware/validation/playlistValidation");
const { validationResult } = require("express-validator");
const {
  validateObjectIdParam,
} = require("../middleware/validation/paramValidation");


// Playlists routes

// GET all playlists
router.get("/users/:id/playlists", 
    authenticateUser, 
    validateObjectIdParam("id"),
    playlistController.getUserPlaylists
);

// GET a playlist by ID
router.post(
  "/users/:id/playlists",
  authenticateUser,
  validateObjectIdParam("id"),
  validateCreatePlaylist,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  playlistController.createPlaylist
);

// CREATE a new playlist
router.put("/playlists/:playlistId", 
    authenticateUser, 
    validateObjectIdParam("playlistId"),
    playlistController.updatePlaylist
);

// DELETE a playlist
router.delete("/playlists/:playlistId", 
    authenticateUser, 
    validateObjectIdParam("playlistId"),
    playlistController.deletePlaylist
);
    
module.exports = router;