const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../server");
const { getDb } = require("../db/connect");
const { ObjectId } = require("mongodb");

// Create a mock valid token
const mockValidToken = jwt.sign(
  { userId: "67e3618201972b9408c14739" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

// Mock the database functions
jest.mock("../db/connect");

describe("Curated Playlists Controller", () => {
  beforeEach(() => {
    getDb.mockReset();
  });

  // Test for GET curated playlists
  it("should return all curated playlists for a user", async () => {
    const mockCuratedPlaylists = [
      { _id: new ObjectId().toString(), userId: "67e3618201972b9408c14739", name: "Replays", songs: [] },
      { _id: new ObjectId().toString(), userId: "67e3618201972b9408c14739", name: "Favorites", songs: [] },
    ];

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockCuratedPlaylists),
        }),
      }),
    });

    const res = await request(app)
      .get("/curatedPlaylists/users/67e3618201972b9408c14739/curated") // Updated route
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockCuratedPlaylists);
  });

  // Test for refreshing curated playlists
  it("should refresh curated playlists for a user", async () => {
    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        deleteMany: jest.fn().mockResolvedValue({ deletedCount: 3 }),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([]),
        }),
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([]),
        }),
        insertMany: jest.fn().mockResolvedValue({ insertedCount: 3 }),
      }),
    });

    const res = await request(app)
      .post("/curatedPlaylists//users/67e3618201972b9408c14739/curated/refresh") 
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Curated playlists refreshed");
  });

  // Test for invalid ObjectId in GET request 
  it("should return 400 for invalid ObjectId in GET request", async () => {
    const invalidUserId = "invalid-id";
  
    const res = await request(app)
      .get(`/curatedPlaylists/users/${invalidUserId}/curated`)
      .set("Authorization", `Bearer ${mockValidToken}`);
  
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid id");  // Match the structure returned by the middleware
  });
  
  it("should return 400 for invalid ObjectId in POST request", async () => {
    const invalidUserId = "invalid-id";
  
    const res = await request(app)
      .post(`/curatedPlaylists/users/${invalidUserId}/curated/refresh`)
      .set("Authorization", `Bearer ${mockValidToken}`);
  
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid id");  // Match the structure returned by the middleware
  });
  
});
