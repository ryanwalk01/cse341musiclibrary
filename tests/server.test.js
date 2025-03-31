const request = require("supertest");
const app = require("../server");

describe("Server Endpoints", () => {
  test("GET /nonexistent should return 404", async () => {
    const response = await request(app).get("/nonexistent");
    expect(response.status).toBe(404);
  });

  test("OPTIONS request should return correct CORS headers", async () => {
    const response = await request(app).options("/");
    expect(response.status).toBe(204); 
    expect(response.headers["access-control-allow-origin"]).toBe("*");
    expect(response.headers["access-control-allow-methods"]).toContain("GET");
  });
});
