const { getDb } = require("../db/connect");

// Helper function to create a liked song entry
const createLikedSong = async (userId, songId) => {
  const likedSong = {
    userId,
    songId,
    liked_at: new Date().toISOString(),
  };

  try {
    const db = getDb();
    const result = await db.collection("liked_songs").insertOne(likedSong);
    return result;
  } catch (error) {
    console.error("Error creating liked song:", error);
    throw new Error("Error adding liked song");
  }
};

// Helper function to remove a liked song entry
const removeLikedSong = async (userId, songId) => {
  try {
    const db = getDb();
    const result = await db.collection("liked_songs").deleteOne({ userId, songId });
    return result;
  } catch (error) {
    console.error("Error removing liked song:", error);
    throw new Error("Error removing liked song");
  }
};

// Get liked songs for a user
const getLikedSongs = async (req, res) => {
  const userId = req.params.id;

  try {
    const db = getDb();
    const likedSongs = await db.collection("liked_songs").find({ userId }).toArray();
    
    if (likedSongs.length === 0) {
      return res.status(404).json({ message: "No liked songs found for this user" });
    }
    
    res.status(200).json(likedSongs);
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    res.status(500).json({ message: "Error fetching liked songs", error: error.message });
  }
};

// Like a song for a user
const likeSong = async (req, res) => {
  const userId = req.params.id;
  const { songId } = req.body;

  if (!songId) {
    return res.status(400).json({ message: "Missing songId" });
  }

  try {
    // Check if the song is already liked
    const db = getDb();
    const existingLike = await db.collection("liked_songs").findOne({ userId, songId });

    if (existingLike) {
      return res.status(400).json({ message: "Song already liked" });
    }

    const result = await createLikedSong(userId, songId);

    if (result.insertedId) {
      res.status(201).json({
        message: "Song liked successfully",
        likedSong: { userId, songId, liked_at: new Date().toISOString() },
      });
    } else {
      res.status(500).json({ message: "Error liking song" });
    }
  } catch (error) {
    console.error("Error liking song:", error);
    res.status(500).json({ message: "Error liking song", error: error.message });
  }
};

// Unlike a song for a user
const unlikeSong = async (req, res) => {
  const userId = req.params.id;
  const { songId } = req.body;

  if (!songId) {
    return res.status(400).json({ message: "Missing songId" });
  }

  try {
    const db = getDb();
    const existingLike = await db.collection("liked_songs").findOne({ userId, songId });

    if (!existingLike) {
      return res.status(404).json({ message: "Song not found in liked songs" });
    }

    const result = await removeLikedSong(userId, songId);

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Song unliked successfully" });
    } else {
      res.status(500).json({ message: "Error unliking song" });
    }
  } catch (error) {
    console.error("Error unliking song:", error);
    res.status(500).json({ message: "Error unliking song", error: error.message });
  }
};

module.exports = {
  getLikedSongs,
  likeSong,
  unlikeSong,
};
