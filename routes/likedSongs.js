const express = require('express');
const router = express.Router();
const likedSongsController = require('../controllers/likedSongController.js');
const authenticateUser = require('../middleware/authMiddleware.js');

// Liked songs routes
router.get("/users/:id/liked", authenticateUser, likedSongsController.getLikedSongs);
router.post("/songs/:id/like", authenticateUser, likedSongsController.likeSong);
router.delete("/songs/:id/unlike", authenticateUser, likedSongsController.unlikeSong);

module.exports = router;