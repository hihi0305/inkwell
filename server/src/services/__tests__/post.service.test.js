// server/src/services/__tests__/post.service.test.js

import { jest } from "@jest/globals";

const mockPostRepository = {createWithTags: jest.fn(), searchPublished: jest.fn()};
const mockEventBus = { emit: jest.fn() };

jest.unstable_mockModule("../../repositories/post.repository.js", () => ({
  PostRepository: mockPostRepository,
}));

jest.unstable_mockModule("../../events/event-bus.js", () => ({
  EventBus: mockEventBus,
}));

const { PostService } = await import("../post.service.js");

test("publish() creates a PUBLISHED post and emits post.published", async () => {
  mockPostRepository.createWithTags.mockResolvedValue({
    id: "p1",
    title: "Hello",
    status: "PUBLISHED",
  });

  const post = await PostService.publish({
    authorId: "u1",
    title: "Hello",
    body: "World",
  });

  expect(post.status).toBe("PUBLISHED");
  expect(mockEventBus.emit).toHaveBeenCalledWith(
    "post.published",
    expect.objectContaining({ postId: "p1" })
  );
});

test("publish() rejects an empty title", async () => {
  await expect(
    PostService.publish({
      authorId: "u1",
      title: "",
      body: "World",
    })
  ).rejects.toThrow();
});


describe("PostService.search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns search results for a valid query (row 1)", async () => {
    const expected = {
      posts: [{ id: "p1", title: "JavaScript Basics" }],
      hasMore: false,
    };

    mockPostRepository.searchPublished.mockResolvedValue(expected);

    const result = await PostService.search({
      query: "JavaScript",
    });

    expect(result).toEqual(expected);
  });

  test("uses default pagination values (row 2)", async () => {
    mockPostRepository.searchPublished.mockResolvedValue({
      posts: [],
      hasMore: false,
    });

    await PostService.search({
      query: "testing",
    });

    expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({
      query: "testing",
      page: 1,
      pageSize: 10,
    });
  });

  test("accepts custom pagination values (row 3)", async () => {
    mockPostRepository.searchPublished.mockResolvedValue({
      posts: [],
      hasMore: false,
    });

    await PostService.search({
      query: "testing",
      page: 2,
      pageSize: 5,
    });

    expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({
      query: "testing",
      page: 2,
      pageSize: 5,
    });
  });

  test("returns the repository result through the search strategy (row 4)", async () => {
    const expected = {
      posts: [{ id: "p2", title: "Software Design" }],
      hasMore: true,
    };

    mockPostRepository.searchPublished.mockResolvedValue(expected);

    const result = await PostService.search({
      query: "design",
    });

    expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({
      query: "design",
      page: 1,
      pageSize: 10,
    });

    expect(result).toBe(expected);
  });
});
