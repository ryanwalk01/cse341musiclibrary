const { body } = require("express-validator");

const validateCreatePlaylist = [
  body("name").trim().notEmpty().withMessage("Playlist name is required"),

  body("songs")
    .optional()
    .isArray()
    .withMessage("Songs must be an array of song IDs"),

  body("songs.*")
    .optional()
    .isString()
    .withMessage("Each song ID must be a string"),
];

module.exports = {
  validateCreatePlaylist,
};
