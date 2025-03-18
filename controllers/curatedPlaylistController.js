const { getDb } = require("../db/connect");
const { ObjectId } = require("mongodb");

const getCuratedPlaylists = async (req, res) => {
  try {
    const db = getDb();
    const curatedPlaylists = await db.collection("curated_playlists").find().toArray();
    res.status(200).json(curatedPlaylists);
  } catch (error) {
    res.status(500).json({ message: "Error fetching curated playlists", error });
  }
};

const refreshCuratedPlaylists = async (req, res) => {
  try {
    const db = getDb();
    const userId = ObjectId(req.params.user_id); 

    await db.collection("curated_playlists").deleteMany({ user_id: userId });

    const listeningHistory = await db.collection("listening_history")
      .aggregate([{ $match: { user_id: userId } }, { $sample: { size: 5 } }]).toArray();

    const historySongIds = listeningHistory.map(song => song.song_id);

    const replaysPlaylist = {
      user_id: userId,
      name: "Replays",
      songs: historySongIds, 
      date_created: new Date()
    };

    const likedSongs = await db.collection("liked_songs")
      .aggregate([{ $match: { user_id: userId } }, { $sample: { size: 5 } }]).toArray();

    const likedSongIds = likedSongs.map(song => song.song_id);

    const favoritesPlaylist = {
      user_id: userId,
      name: "Favorites",
      songs: likedSongIds,
      date_created: new Date()
    };

    const playlists = await db.collection("playlists")
      .find({ user_id: userId }).toArray();

    const allSongIds = playlists.flatMap(playlist => playlist.songs.map(song => song.song_id));

    const playlistSongIds = [];
    while (playlistSongIds.length < 5) {
      const randomIndex = Math.floor(Math.random() * allSongIds.length);
      const randomSongId = allSongIds[randomIndex];
      if (!playlistSongIds.includes(randomSongId)) {
        playlistSongIds.push(randomSongId); 
      }
    }

    const mix = {
      user_id: userId,
      name: "Mix",
      songs: playlistSongIds,
      date_created: new Date()
    };

    await db.collection("curated_playlists").insertOne(replaysPlaylist);
    await db.collection("curated_playlists").insertOne(favoritesPlaylist);
    await db.collection("curated_playlists").insertOne(mix);

    res.status(200).json({ message: "Curated playlists refreshed" });
  } catch (error) {
    res.status(500).json({ message: "Error refreshing curated playlists", error });
  }
};

module.exports = {
  getCuratedPlaylists,
  refreshCuratedPlaylists
};