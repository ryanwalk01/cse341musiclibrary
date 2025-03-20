const { getDb } = require("../db/connect");

// Helper function to create a listening history entry
const addToHistory = async (userId, songId) => {
  const historyEntry = {
    userId,
    songId,
    listened_at: new Date().toISOString(),
  };

  try {
    const db = getDb();
    const result = await db.collection("listening_history").insertOne(historyEntry);
    return result;
  } catch (error) {
    console.error("Error adding to listening history:", error);
    throw new Error("Error adding to listening history");
  }
};

// Helper function to remove a listening history entry
const removeFromHistory = async (userId, songId) => {
  try {
    const db = getDb();
    const result = await db.collection("listening_history").deleteOne({ userId, songId });
    return result;
  } catch (error) {
    console.error("Error removing from listening history:", error);
    throw new Error("Error removing from listening history");
  }
};

// Get listening history for a user
const getListeningHistory = async (req, res) => {
  const userId = req.params.id;

  try {
    const db = getDb();
    const history = await db.collection("listening_history").find({ userId }).toArray();

    if (history.length === 0) {
      return res.status(404).json({ message: "No listening history found for this user" });
    }

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching listening history:", error);
    res.status(500).json({ message: "Error fetching listening history", error: error.message });
  }
};

// Add a song to listening history
const logListening = async (req, res) => {
  const userId = req.params.id;
  const { songId } = req.body;

  if (!songId) {
    return res.status(400).json({ message: "Missing songId" });
  }

  try {
    const result = await addToHistory(userId, songId);

    if (result.insertedId) {
      res.status(201).json({
        message: "Song added to listening history successfully",
        historyEntry: { userId, songId, listened_at: new Date().toISOString() },
      });
    } else {
      res.status(500).json({ message: "Error adding to listening history" });
    }
  } catch (error) {
    console.error("Error logging listening:", error);
    res.status(500).json({ message: "Error logging listening", error: error.message });
  }
};

// Remove a song from listening history
const deleteListeningEntry = async (req, res) => {
  const userId = req.params.id;
  const { songId } = req.body;

  if (!songId) {
    return res.status(400).json({ message: "Missing songId" });
  }

  try {
    const db = getDb();
    const existingEntry = await db.collection("listening_history").findOne({ userId, songId });

    if (!existingEntry) {
      return res.status(404).json({ message: "Song not found in listening history" });
    }

    const result = await removeFromHistory(userId, songId);

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Song removed from listening history successfully" });
    } else {
      res.status(500).json({ message: "Error removing from listening history" });
    }
  } catch (error) {
    console.error("Error deleting listening entry:", error);
    res.status(500).json({ message: "Error deleting listening entry", error: error.message });
  }
};

module.exports = {
  getListeningHistory,
  logListening,
  deleteListeningEntry,
};
