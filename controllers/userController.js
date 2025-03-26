const { getDb } = require("../db/connect");
const { ObjectId } = require("mongodb");

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const db = getDb();
    const users = await db.collection("users").find().toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// GET a user by ID
const getUserById = async (req, res) => {
  try {
    const db = getDb();
    const userId = req.params.id;
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// CREATE a new user
const createUser = async (req, res) => {
  const { email, firstName, lastName, role } = req.body;

  if (!email || !firstName || !lastName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const db = getDb();
    const newUser = { email, firstName, lastName, role: role || "user", createdAt: new Date()};

    const result = await db.collection("users").insertOne(newUser);

    // Ensure result is not undefined and check if it contains insertedId
    if (result.insertedId) {
      res.status(201).json({
        message: "User created successfully",
        user: { ...newUser, _id: result.insertedId },
      });
    } else {
      res.status(500).json({ message: "Error inserting user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// UPDATE an existing user by ID
const updateUser = async (req, res) => {
  const { email, firstName, lastName, role } = req.body;
  const userIdParam = req.params.id;

  if (!email && !firstName && !lastName && !role) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const db = getDb();
    const updatedUser = {
      $set: {
        email,
        firstName,
        lastName,
        role
      },
    };

    const result = await db.collection("users").updateOne({ _id: new ObjectId(userIdParam) }, updatedUser);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// DELETE a user by ID
const deleteUser = async (req, res) => {
  try {
    const db = getDb();
    const userId = req.params.id;
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
