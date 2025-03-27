const jwt = require("jsonwebtoken"); 
const request = require("supertest");
const app = require("../server"); 
const { getDb } = require("../db/connect");
const { ObjectId } = require("mongodb");

// Create a mock valid token using JWT_SECRET from environment
const mockValidToken = jwt.sign(
  { userId: "67e3618201972b9408c14739" },
  process.env.JWT_SECRET, 
  { expiresIn: "1h" }  
);

// Mock the database functions
jest.mock("../db/connect");

describe("Song Controller", () => {
  beforeEach(() => {
    // Reset the mock database before each test
    getDb.mockReset();
  });

  // Test for GET all songs
  it("should return all songs", async () => {
    const mockSongs = [
      { _id: new ObjectId().toString(), title: "Song 1", artist: "Artist 1" },
      { _id: new ObjectId().toString(), title: "Song 2", artist: "Artist 2" },
    ];

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockSongs),
        }),
      }),
    });

    const res = await request(app)
      .get("/songs")
      .set("Authorization", `Bearer ${mockValidToken}`); 

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockSongs);
  });

  // Test for GET song by ID
  it("should return a song by ID", async () => {
    const mockSong = { _id: new ObjectId().toString(), title: "Song 1", artist: "Artist 1" };
    const songId = mockSong._id.toString();

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockSong),
      }),
    });

    const res = await request(app)
      .get(`/songs/${songId}`)
      .set("Authorization", `Bearer ${mockValidToken}`); 

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockSong);
  });

  // Test for POST create a new song with validation
  it("should create a new song with valid data", async () => {
    const newSong = {
      title: "New Song",
      artist: "New Artist",
      album: "New Album",
      release_date: "2023-01-01",
      genre: "Pop",
      cover_art: "https://example.com/cover.jpg",
      url: "https://example.com/song.mp3",
    };

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        insertOne: jest.fn().mockResolvedValue({
          insertedId: new ObjectId(),
        }),
      }),
    });

    const res = await request(app)
      .post("/songs")
      .send(newSong)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockValidToken}`); 

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Song added successfully");
    expect(res.body.song.title).toBe(newSong.title);
  });

  // Test for POST create song with missing fields (validation failure)
  it("should return 400 if required fields are missing in POST", async () => {
    const incompleteSong = {
      title: "Incomplete Song",
      artist: "", // Missing artist field
      release_date: "invalid-date", // Invalid date format
      cover_art: "not-a-valid-url", // Invalid URL format
    };

    const res = await request(app)
      .post("/songs")
      .send(incompleteSong)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  // Test for PUT update song with validation
  it("should update a song by ID with valid data", async () => {
    const updatedSong = {
      title: "Updated Song",
      artist: "Updated Artist",
      album: "Updated Album",
      release_date: "2024-06-15",
      genre: "Rock",
      cover_art: "https://example.com/updated_cover.jpg",
      url: "https://example.com/updated_song.mp3",
    };

    const songId = new ObjectId().toString();

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        updateOne: jest.fn().mockResolvedValue({
          matchedCount: 1,
        }),
      }),
    });

    const res = await request(app)
      .put(`/songs/${songId}`)
      .send(updatedSong)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockValidToken}`); 

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Song updated successfully");
  });

  // Test for PUT update song with invalid data (validation failure)
  it("should return 400 if update contains invalid data", async () => {
    const invalidUpdate = {
      title: "", // Empty title
      cover_art: "invalid-url", // Invalid URL
    };

    const songId = new ObjectId().toString();

    const res = await request(app)
      .put(`/songs/${songId}`)
      .send(invalidUpdate)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  // Test for DELETE song by ID
  it("should delete a song by ID", async () => {
    const songId = new ObjectId().toString();

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        deleteOne: jest.fn().mockResolvedValue({
          deletedCount: 1,
        }),
      }),
    });

    const res = await request(app)
      .delete(`/songs/${songId}`)
      .set("Authorization", `Bearer ${mockValidToken}`); 

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Song deleted successfully");
  });

  // Test for DELETE song with invalid ID
  it("should return 400 if deleting a song with invalid ID", async () => {
    const invalidSongId = "123"; 

    const res = await request(app)
      .delete(`/songs/${invalidSongId}`)
      .set("Authorization", `Bearer ${mockValidToken}`);
      console.log(res.body);
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});
