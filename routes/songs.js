const express = require("express");
const router = express.Router();
const songController = require("../controllers/songController");

// Songs routes
router.get("/", songController.getAllSongs);
router.get("/:id", songController.getSongById);
router.post("/", songController.createSong);
router.put("/:id", songController.updateSong);
router.delete("/:id", songController.deleteSong);

module.exports = router;
