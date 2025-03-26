const jwt = require("jsonwebtoken"); 
const request = require("supertest");
const app = require("../server"); 
const { getDb } = require("../db/connect");
const { ObjectId } = require("mongodb");

// Create a mock valid token using JWT_SECRET from environment // Adjust expiration time if needed
const mockValidToken = jwt.sign(
  { userId: '67e3618201972b9408c14739' },
  process.env.JWT_SECRET, 
  { expiresIn: '1h' }  
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

  // Test for POST create a new song
  it("should create a new song", async () => {
    const newSong = {
      title: "New Song",
      artist: "New Artist",
      album: "New Album",
      release_date: "2023-01-01",
      cover_art: "url_to_cover_art",
      genre: "Pop",
      url: "url_to_song",
      songId: "song123",
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

  // Test for PUT update song
  it("should update a song by ID", async () => {
    const updatedSong = {
      title: "Updated Song",
      artist: "Updated Artist",
      album: "Updated Album",
      release_date: "2023-01-01",
      cover_art: "updated_cover_art_url",
      genre: "Pop",
      url: "updated_url",
      songId: "updatedSong123",
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


});
