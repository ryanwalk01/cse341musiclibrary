const express = require('express');
const router = express.Router();
const curatedPlaylistsController = require('../controllers/curatedPlaylistController.js');

router.get(
  "/users/:id/curated",
  curatedPlaylistsController.getCuratedPlaylists
);
router.post(
  "/users/:id/curated/refresh",
  curatedPlaylistsController.refreshCuratedPlaylists
);

module.exports = router;