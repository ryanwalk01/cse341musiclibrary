const express = require('express');
const router = express.Router();
const curatedPlaylistsController = require('../controllers/curatedPlaylistController.js');
const authenticateUser = require('../middleware/authMiddleware.js');

router.get(
  "/users/:id/curated",
  authenticateUser,
  curatedPlaylistsController.getCuratedPlaylists
);
router.post(
  "/users/:id/curated/refresh",
  authenticateUser,
  curatedPlaylistsController.refreshCuratedPlaylists
);

module.exports = router;