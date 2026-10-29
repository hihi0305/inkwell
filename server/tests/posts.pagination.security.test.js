import request from "supertest";
import { jest, test, expect } from "@jest/globals";

jest.unstable_mockModule("../src/services/post.service.js", () => ({
  PostService: {
    publish: jest.fn(),
    search: jest.fn(),
    listPublished: jest.fn(),
  },
}));

const { PostService } = await import("../src/services/post.service.js");
const { app } = await import("../src/app.js");

test("clamps oversized pageSize to 100", async () => {
  PostService.listPublished.mockResolvedValue({
    posts: [],
    page: 1,
    hasMore: false,
  });

  const response = await request(app)
    .get("/api/posts?page=1&pageSize=10000");

  expect(response.status).toBe(200);

  expect(PostService.listPublished).toHaveBeenCalledWith({
    page: 1,
    pageSize: 100,
  });
});
