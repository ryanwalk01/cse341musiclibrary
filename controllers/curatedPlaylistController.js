const { getDb } = require("../db/connect");
const { ObjectId } = require("mongodb");

const getCuratedPlaylists = async (req, res) => {
  try {
    const db = getDb();
    const userId = req.params.id;
    const curatedPlaylists = await db.collection("curated_playlists").find({ userId: userId }).toArray();
    res.status(200).json(curatedPlaylists);
  } catch (error) {
    res.status(500).json({ message: "Error fetching curated playlists", error });
  }
};

const refreshCuratedPlaylists = async (req, res) => {
  try {
    const db = getDb();
    const userId = new ObjectId(req.params.id).toString();

    await db.collection("curated_playlists").deleteMany({ userId: userId });

    const likedSongs = await db.collection("liked_songs")
      .aggregate([{ $match: { userId: userId } }, { $sample: { size: 5 } }]).toArray();

    const likedSongIds = likedSongs.map(song => new ObjectId(song.song));

    const favoritesPlaylist = {
      userId: userId,
      name: "Favorites",
      songs: likedSongIds,
      date_created: new Date()
    };

    const playlists = await db
      .collection("playlists")
      .find({ user_id: userId })
      .toArray();

    const allSongIds = playlists.flatMap((playlist) =>
      playlist.songs
        .filter((song) => song.song_id) // just in case
        .map((song) => new ObjectId(song.song_id))
    );

    const playlistSongIds = [];

    if (allSongIds.length <= 5) {
      playlistSongIds.push(...allSongIds);
    } else {

      while (playlistSongIds.length < 5) {
        const randomIndex = Math.floor(Math.random() * allSongIds.length);
        const randomSongId = allSongIds[randomIndex];

        if (!playlistSongIds.includes(randomSongId)) {
          playlistSongIds.push(randomSongId);
        }
      }
    }

    const mixPlaylist = {
      userId: userId,
      name: "Mix",
      songs: playlistSongIds,
      date_created: new Date()
    };

    await db.collection("curated_playlists").insertMany([ favoritesPlaylist, mixPlaylist ]);

    res.status(200).json({ message: "Curated playlists refreshed" });
  } catch (error) {
    res.status(500).json({ message: "Error refreshing curated playlists", error });
  }
};

module.exports = {
  getCuratedPlaylists,
  refreshCuratedPlaylists
};