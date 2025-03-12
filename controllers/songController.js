const { getDb } = require("../db/connect");
const { ObjectId } = require("mongodb");

//GET all songs
const getAllSongs = async (req, res) => {
    try {
        const db = getDb();
        const songs = await db.collection("songs").find().toArray();
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching songs", error });
    }
};

//GET song by ID
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

module.exports = {
    getAllSongs,
    getSongById
}