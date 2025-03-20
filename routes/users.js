const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require('../middleware/authMiddleware');

// User routes
router.get("/", authenticateUser, userController.getAllUsers);
router.get("/:id", authenticateUser, userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", authenticateUser, userController.updateUser);
router.delete("/:id", authenticateUser, userController.deleteUser);

module.exports = router;