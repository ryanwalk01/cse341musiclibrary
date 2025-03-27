const express = require("express");
const router = express.Router();
const songController = require("../controllers/songController");
const authenticateUser = require("../middleware/authMiddleware");
const {
  validateCreateSong,
  validateUpdateSong,
} = require("../middleware/validation/songValidation");

const {
  validateObjectIdParam,
} = require("../middleware/validation/paramValidation");
const { validationResult } = require("express-validator");


// Songs routes

// GET all songs
router.get("/", songController.getAllSongs); // public route

// GET a song by ID
router.get("/:id", 
    validateObjectIdParam("id"), 
    songController.getSongById
); 

// CREATE a new song
router.post(
  "/",
  authenticateUser,
  validateCreateSong,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  songController.createSong
);

// UPDATE an existing song by ID
router.put(
  "/:id",
  authenticateUser,
  validateObjectIdParam("id"),
  validateUpdateSong,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  songController.updateSong
);

// DELETE a song by ID
router.delete("/:id", 
    authenticateUser, 
    validateObjectIdParam("id"),
    songController.deleteSong);

module.exports = router;
