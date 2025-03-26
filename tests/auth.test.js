const request = require("supertest");
const express = require("express");
const authenticateUser = require("../middleware/authMiddleware"); 
require("dotenv").config();

let app;
const TEST_TOKEN = process.env.GOOGLE_TOKEN ; 

beforeAll(() => {
  app = express();
  app.use(express.json());

  // Dummy protected route for testing
  app.get("/protected", authenticateUser, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
  });
});

describe("Authentication Middleware Tests", () => {
    test("✅ Returns 200 and user data with valid token", async () => {
        const res = await request(app)
          .get("/protected")
          .set("Authorization", `Bearer ${TEST_TOKEN}`);
      
        console.log("Response:", res.body); 
      
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.user).toBeDefined();
    });
      

  test("❌ Returns 401 if no token is provided", async () => {
    const res = await request(app).get("/protected");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Unauthorized: Token not provided");
  });

  test("❌ Returns 401 if token is invalid", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalid_token");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid token");
  });
});
