const router = require('express').Router();

// Music routes
router.use("/songs", require("./songs"));
router.use("/likedSongs", require("./likedSongs"));
router.use("/playlists", require("./playlists"));
router.use("/curatedPlaylists", require("./curatedPlaylists"));
router.use("/listeningHistory", require("./listeningHistory"));

// User routes
router.use("/users", require("./users"));

// Documentation routes
router.use('/api-docs', require('./swagger'));

// Auth routes
router.use("/auth", require("./auth"));

module.exports = router;
