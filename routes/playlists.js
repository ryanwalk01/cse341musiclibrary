const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController.js');

// Playlists routes
router.get("/users/:id/playlists", playlistController.getUserPlaylists);
router.post("/users/:id/playlists", playlistController.createPlaylist);
router.put("/playlists/:id", playlistController.updatePlaylist);
router.delete("/playlists/:id", playlistController.deletePlaylist);
    
module.exports = router;