const express = require("express");
const router = express.Router();
const songController = require("../controllers/songController");
const authenticateUser = require("../middleware/authMiddleware");

// Songs routes
router.get("/", songController.getAllSongs); // public route
router.get("/:id", songController.getSongById); // public route
router.post("/", authenticateUser, songController.createSong);
router.put("/:id", authenticateUser, songController.updateSong);
router.delete("/:id", authenticateUser, songController.deleteSong);

module.exports = router;
