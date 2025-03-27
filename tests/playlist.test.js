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

describe("Playlist Controller", () => {
  beforeEach(() => {
    getDb.mockReset();
  });

  // Test for GET user playlists
  it("should return all playlists for a user", async () => {
    const mockPlaylists = [
      { _id: new ObjectId().toString(), userId: "67e3618201972b9408c14739", name: "My Playlist", songs: [] },
      { _id: new ObjectId().toString(), userId: "67e3618201972b9408c14739", name: "Favorites", songs: [] },
    ];

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockPlaylists),
        }),
      }),
    });

    const res = await request(app)
      .get("/playlists/users/67e3618201972b9408c14739/playlists")
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockPlaylists);
  });

  // Test for POST create a new playlist
  it("should create a new playlist", async () => {
    const newPlaylist = {
      name: "New Playlist",
      songs: [],
    };

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        insertOne: jest.fn().mockResolvedValue({ insertedId: new ObjectId() }),
      }),
    });

    const res = await request(app)
      .post("/playlists/users/67e3618201972b9408c14739/playlists")
      .send(newPlaylist)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Playlist created successfully");
  });

  // Test for PUT update a playlist
  it("should update a playlist", async () => {
    const updatedPlaylist = {
      name: "Updated Playlist",
      songs: [],
    };
    const playlistId = new ObjectId().toString();

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
      }),
    });

    const res = await request(app)
      .put(`/playlists/playlists/${playlistId}`)
      .send(updatedPlaylist)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Playlist updated successfully");
  });

  // Test for DELETE a playlist
  it("should delete a playlist", async () => {
    const playlistId = new ObjectId().toString();

    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      }),
    });

    const res = await request(app)
      .delete(`/playlists/playlists/${playlistId}`)
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Playlist deleted successfully");
  });

  // Test for GET user playlists with no playlists
  it("should return 404 if no playlists are found for the user", async () => {
    getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([]),
        }),
      }),
    });

    const res = await request(app)
      .get("/playlists/users/67e3618201972b9408c14739/playlists")
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No playlists found for this user");
  });

  // Test for invalid playlist ID on PUT and DELETE
  it("should return 400 for invalid playlist ID", async () => {
    const invalidPlaylistId = "invalid-id";
  
    const resPut = await request(app)
      .put(`/playlists/playlists/${invalidPlaylistId}`)
      .set("Authorization", `Bearer ${mockValidToken}`);
  
    // Check the status and structure of the error message
    expect(resPut.status).toBe(400);
    expect(resPut.body.errors[0].msg).toBe("Invalid playlistId");
  
    const resDelete = await request(app)
      .delete(`/playlists/playlists/${invalidPlaylistId}`)
      .set("Authorization", `Bearer ${mockValidToken}`);
  
    // Check the status and structure of the error message
    expect(resDelete.status).toBe(400);
    expect(resDelete.body.errors[0].msg).toBe("Invalid playlistId");
  });
  

  // Test for validation errors on creating a playlist
  it("should return 400 if validation fails on creating a playlist", async () => {
    const invalidPlaylist = {
      name: "", // Name is required, this should trigger an error
    };

    const res = await request(app)
      .post("/playlists/users/67e3618201972b9408c14739/playlists")
      .send(invalidPlaylist)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockValidToken}`);

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toBe("Playlist name is required");
  });
});
