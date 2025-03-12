const express = require('express');
const router = express.Router();
const listeningHistoryController = require('../controllers/listeningHistoryController.js');

// Listening history routes
router.get("/users/:id/history", listeningHistoryController.getListeningHistory);
router.post("/songs/:id/history", listeningHistoryController.addToHistory);
router.delete("/songs/:id/history", listeningHistoryController.removeFromHistory);



module.exports = router;