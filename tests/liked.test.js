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

describe("Liked Songs Controller", () => {
  beforeEach(() => {
    getDb.mockReset();
  });

  // Test for GET liked songs by user ID
  it("should return liked songs for a user", async () => {
    const mockLikedSongs = [
      { _id: new ObjectId().toString(), userId: "67e3618201972b9408c14739", songId: "song123", liked_at: "2023-01-01T12:00:00Z" },
      { _id: new ObjectId().toString(), userId: "67e3618201972b9408c14739", songId: "song124", liked_at: "2023-01-02T12:00:00Z" },
    ];

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockLikedSongs),
        }),
      }),
    });

    const res = await request(app)
      .get("/likedSongs/users/67e3618201972b9408c14739/liked")
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockLikedSongs);
  });

  // Test for POST like a song
  it("should like a song for a user", async () => {
    const songToLike = { songId: "song123" };
    const userId = "67e3618201972b9408c14739";

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null), // no existing like
        insertOne: jest.fn().mockResolvedValue({ insertedId: new ObjectId() }),
      }),
    });

    const res = await request(app)
      .post(`/likedSongs/users/${userId}/like`) // Update the route to include user ID
      .send(songToLike)
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Song liked successfully");
    expect(res.body.likedSong.songId).toBe(songToLike.songId);
  });

  // Test for POST like a song (song already liked)
  it("should return an error if song is already liked", async () => {
    const songToLike = { songId: "song123" };
    const userId = "67e3618201972b9408c14739";

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue({ userId, songId: songToLike.songId }), // song already liked
      }),
    });

    const res = await request(app)
      .post(`/likedSongs/users/${userId}/like`) // Update the route to include user ID
      .send(songToLike)
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Song already liked");
  });

  // Test for DELETE unlike a song
  it("should unlike a song for a user", async () => {
    const songToUnlike = { songId: "song123" };
    const userId = "67e3618201972b9408c14739";

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue({ userId, songId: songToUnlike.songId }), // song is liked
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      }),
    });

    const res = await request(app)
      .delete(`/likedSongs/users/${userId}/unlike`) // Update the route to include user ID
      .send(songToUnlike)
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Song unliked successfully");
  });

  // Test for DELETE unlike a song (song not found in liked songs)
  it("should return an error if song is not found in liked songs", async () => {
    const songToUnlike = { songId: "song123" };
    const userId = "67e3618201972b9408c14739";

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null), // song not found
      }),
    });

    const res = await request(app)
      .delete(`/likedSongs/users/${userId}/unlike`) // Update the route to include user ID
      .send(songToUnlike)
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Song not found in liked songs");
  });
});
