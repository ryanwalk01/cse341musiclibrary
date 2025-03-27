const { body } = require("express-validator");

const validateCreateSong = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("artist").trim().notEmpty().withMessage("Artist is required"),
  body("album").trim().notEmpty().withMessage("Album is required"),
  body("release_date")
    .isISO8601()
    .toDate()
    .withMessage("Valid release date required"),
  body("genre").trim().notEmpty().withMessage("Genre is required"),
  body("cover_art").trim().isURL().withMessage("Cover art must be a valid URL"),
  body("url").trim().isURL().withMessage("Song URL must be a valid URL"),
];

const validateUpdateSong = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  body("artist")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Artist cannot be empty"),
  body("album")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Album cannot be empty"),
  body("release_date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Valid release date required"),
  body("genre")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Genre cannot be empty"),
  body("cover_art")
    .optional()
    .trim()
    .isURL()
    .withMessage("Cover art must be a valid URL"),
  body("url")
    .optional()
    .trim()
    .isURL()
    .withMessage("Song URL must be a valid URL"),
];

module.exports = {
  validateCreateSong,
  validateUpdateSong,
};
