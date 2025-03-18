const { getDb } = require("../db/connect");
const { ObjectId } = require("mongodb");

// GET all songs
const getAllSongs = async (req, res) => {
    try {
        const db = getDb();
        const songs = await db.collection("songs").find().toArray();
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching songs", error });
    }
};

// GET song by ID
const getSongById = async (req, res) => {
    try {
        const db = getDb();
        const songId = req.params.id;
        const song = await db.collection("songs").findOne({ _id: new ObjectId(songId) });

        if (song) {
            res.status(200).json(song);
        } else {
            res.status(404).json({ message: "Song not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching song", error });
    }
};

// CREATE a new song
const createSong = async (req, res) => {
    const { title, artist, album, release_date, cover_art, genre, url, songId } = req.body;
  
    if (!title || !artist || !album || !release_date || !cover_art || !genre || !url || !songId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      const db = getDb(); 
      const newSong = { title, artist, album, release_date, cover_art, genre, url, songId };
  
      const result = await db.collection("songs").insertOne(newSong);
  
      // Ensure result is not undefined and check if it contains insertedId
      if (result.insertedId) {
        res.status(201).json({
          message: "Song added successfully",
          song: { ...newSong, _id: result.insertedId }
        });
      } else {
        res.status(500).json({ message: "Error inserting song" });
      }
    } catch (error) {
      console.error("Error adding song:", error);
      res.status(500).json({ message: "Error adding song", error: error.message });
    }
  };

// UPDATE an existing song by ID
const updateSong = async (req, res) => {
    try {
        const db = getDb();
        const songId = req.params.id;
        const updatedSong = {
            $set: {
                title: req.body.title,
                artist: req.body.artist,
                album: req.body.album,
                release_date: req.body.release_date,
                cover_art: req.body.cover_art,
                genre: req.body.genre,
                url: req.body.url,
                songId: req.body.songId
            }
        };

        const result = await db.collection("songs").updateOne({ _id: new ObjectId(songId) }, updatedSong);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Song not found" });
        }

        res.status(200).json({ message: "Song updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating song", error });
    }
};

// DELETE a song by ID
const deleteSong = async (req, res) => {
    try {
        const db = getDb();
        const songId = req.params.id;
        const result = await db.collection("songs").deleteOne({ _id: new ObjectId(songId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Song not found" });
        }

        res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting song", error });
    }
};

module.exports = {
    getAllSongs,
    getSongById,
    createSong,
    updateSong,
    deleteSong
};
