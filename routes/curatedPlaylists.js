const express = require('express');
const router = express.Router();
const curatedPlaylistsController = require('../controllers/curatedPlaylistController.js');
const authenticateUser = require('../middleware/authMiddleware.js');
const {
  validateObjectIdParam,
} = require("../middleware/validation/paramValidation");


router.get(
  "/users/:id/curated",
  authenticateUser,
  validateObjectIdParam("id"),
  curatedPlaylistsController.getCuratedPlaylists
);
router.post(
  "/users/:id/curated/refresh",
  authenticateUser,
  validateObjectIdParam("id"),
  curatedPlaylistsController.refreshCuratedPlaylists
);

module.exports = router;