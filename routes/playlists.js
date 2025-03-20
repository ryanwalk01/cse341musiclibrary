const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController.js');
const authenticateUser = require('../middleware/authMiddleware.js');

// Playlists routes
router.get("/users/:id/playlists", authenticateUser, playlistController.getUserPlaylists);
router.post("/users/:id/playlists",authenticateUser, playlistController.createPlaylist);
router.put("/playlists/:id", authenticateUser, playlistController.updatePlaylist);
router.delete("/playlists/:id", authenticateUser, playlistController.deletePlaylist);
    
module.exports = router;