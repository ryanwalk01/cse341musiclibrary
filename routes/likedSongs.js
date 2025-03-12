const express = require('express');
const router = express.Router();
const likedSongsController = require('../controllers/likedSongController.js');

// Liked songs routes
router.get("/users/:id/liked", likedSongsController.getLikedSongs);
router.post("/songs/:id/like", likedSongsController.likeSong);
router.delete("/songs/:id/unlike", likedSongsController.unlikeSong);

module.exports = router;