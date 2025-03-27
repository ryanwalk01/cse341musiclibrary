const { getDb } = require("../db/connect");
const { ObjectId } = require("mongodb");

// Get all playlists for a user
const getUserPlaylists = async (req, res) => {
  const userId = req.params.id;

  try {
    const db = getDb();
    const playlists = await db.collection("playlists").find({ userId }).toArray();

    if (playlists.length === 0) {
      return res.status(404).json({ message: "No playlists found for this user" });
    }

    res.status(200).json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ message: "Error fetching playlists", error: error.message });
  }
};

// Create a new playlist
const createPlaylist = async (req, res) => {
  const userId = req.params.id;
  const { name, songs } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Playlist name is required" });
  }

  const playlist = {
    userId,
    name,
    songs: songs || [],
    created_at: new Date().toISOString(),
  };

  try {
    const db = getDb();
    const result = await db.collection("playlists").insertOne(playlist);
    res.status(201).json({ message: "Playlist created successfully", playlist });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ message: "Error creating playlist", error: error.message });
  }
};

// Update a playlist
const updatePlaylist = async (req, res) => {
  const { id } = req.params;
  const { name, songs } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid playlist ID" });
  }

  try {
    const db = getDb();
    const updateData = {};
    if (name) updateData.name = name;
    if (songs) updateData.songs = songs.map(songId => new ObjectId(songId));

    const result = await db.collection("playlists").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Playlist not found or no changes made" });
    }

    res.status(200).json({ message: "Playlist updated successfully" });
  } catch (error) {
    console.error("Error updating playlist:", error);
    res.status(500).json({ message: "Error updating playlist", error: error.message });
  }
};

// Delete a playlist
const deletePlaylist = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid playlist ID" });
  }

  try {
    const db = getDb();
    const result = await db.collection("playlists").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({ message: "Error deleting playlist", error: error.message });
  }
};

module.exports = {
  getUserPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
};
