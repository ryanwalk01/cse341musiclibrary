const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Start Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback - returns JWT token
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = generateToken(req.user);
    res.status(200).json({
      message: "Authentication successful",
      token: token,
      user: req.user,
    });
  }
);


// Logout (Placeholder)
router.post("/logout", (req, res) => {
  res
    .status(200)
    .json({
      message:
        "Logout successful. Please discard your token on the client-side.",
    });
});


module.exports = router;
