const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../server");
const { getDb } = require("../db/connect");
const { ObjectId } = require("mongodb");

// Create a mock valid token
const mockValidToken = jwt.sign(
  { userId: new ObjectId().toString() },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

// Mock the database functions
jest.mock("../db/connect");

describe("User Controller", () => {
  beforeEach(() => {
    getDb.mockReset();
  });

  // Test for GET all users
  it("should return all users", async () => {
    const mockUsers = [
      { _id: new ObjectId().toString(), email: "user1@example.com", firstName: "User", lastName: "One" },
      { _id: new ObjectId().toString(), email: "user2@example.com", firstName: "User", lastName: "Two" },
    ];

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockUsers),
        }),
      }),
    });

    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUsers);
  });

  // Test for GET user by ID with valid ObjectId
  it("should return a user by valid ID", async () => {
    const mockUser = {
      _id: new ObjectId().toString(),
      email: "user@example.com",
      firstName: "User",
      lastName: "Example",
    };

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockUser),
      }),
    });

    const res = await request(app)
      .get(`/users/${mockUser._id}`)
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUser);
  });

  // Test for GET user by ID with invalid ObjectId
  it("should return 400 if user ID is invalid", async () => {
    const invalidUserId = "123"; // Not a valid ObjectId

    const res = await request(app)
      .get(`/users/${invalidUserId}`)
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  // Test for POST create a new user with valid data
  it("should create a new user", async () => {
    const newUser = {
      email: "newuser@example.com",
      firstName: "New",
      lastName: "User",
      role: "user",
    };

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        insertOne: jest.fn().mockResolvedValue({ insertedId: new ObjectId() }),
      }),
    });

    const res = await request(app)
      .post("/users")
      .send(newUser)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User created successfully");
    expect(res.body.user.email).toBe(newUser.email);
  });

  // Test for POST create a user with missing required fields
  it("should return 400 if required fields are missing", async () => {
    const invalidUser = { email: "" }; // Missing firstName and lastName

    const res = await request(app)
      .post("/users")
      .send(invalidUser)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  // Test for PUT update user with valid data
  it("should update a user by ID", async () => {
    const updatedUser = {
      email: "updated@example.com",
      firstName: "Updated",
      lastName: "User",
      role: "admin",
    };
    const userId = new ObjectId().toString();

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
      }),
    });

    const res = await request(app)
      .put(`/users/${userId}`)
      .send(updatedUser)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User updated successfully");
  });

  // Test for PUT update user with invalid ID
  it("should return 400 if updating a user with invalid ID", async () => {
    const invalidUserId = "123"; // Not a valid ObjectId

    const updatedUser = {
      email: "updated@example.com",
      firstName: "Updated",
      lastName: "User",
      role: "admin",
    };

    const res = await request(app)
      .put(`/users/${invalidUserId}`)
      .send(updatedUser)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  // Test for DELETE user by valid ID
  it("should delete a user by ID", async () => {
    const userId = new ObjectId().toString();

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      }),
    });

    const res = await request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");
  });

  // Test for DELETE user with invalid ID
  it("should return 400 if deleting a user with invalid ID", async () => {
    const invalidUserId = "123"; 

    const res = await request(app)
      .delete(`/users/${invalidUserId}`)
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});
