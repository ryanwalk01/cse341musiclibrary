const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require('../middleware/authMiddleware');
const {
  validateCreateUser,
  validateUpdateUser,
} = require("../middleware/validation/userValidation");
;
const { validationResult } = require("express-validator");
const {
  validateObjectIdParam,
} = require("../middleware/validation/paramValidation");

// User routes

// GET all users
router.get("/", authenticateUser, userController.getAllUsers);

// GET a user by ID
router.get("/:id", 
    authenticateUser, 
    validateObjectIdParam("id"),
    userController.getUserById
);

// CREATE a new user
router.post(
  "/",
  validateCreateUser,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // pass to controller if validation passes
  },
  userController.createUser
);

router.put(
  "/:id",
  authenticateUser,
  validateObjectIdParam("id"),
  validateUpdateUser,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // only call controller if input is valid
  },
  userController.updateUser
);

router.delete("/:id", 
    authenticateUser,
    validateObjectIdParam("id"), 
    userController.deleteUser);

module.exports = router;