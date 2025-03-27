const { body } = require("express-validator");

const validateLikeSong = [
  body("songId")
    .trim()
    .notEmpty()
    .withMessage("songId is required")
    .isString()
    .withMessage("songId must be a string"),
];

module.exports = {
  validateLikeSong,
};
