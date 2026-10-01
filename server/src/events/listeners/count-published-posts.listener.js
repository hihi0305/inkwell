// server/src/events/listeners/count-published-posts.listener.js

import { EventBus } from "../event-bus.js";

let totalPublishedPosts = 0;

EventBus.on("post.published", () => {
  totalPublishedPosts += 1;
});

export function getPublishedPostCount() {
  return totalPublishedPosts;
}