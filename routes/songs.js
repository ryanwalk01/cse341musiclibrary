const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

// Songs routes
router.get("/", songController.getAllSongs);
router.get("/:id", songController.getSongById);

module.exports = router;