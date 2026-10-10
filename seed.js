import redis from "./redis.js";

async function seed() {
  await redis.del("trending:posts");

  const pipeline = redis.pipeline();
  for (let i = 1; i <= 100; i++) {
    const id = `post:${i}`;
    const score = Math.floor(Math.random() * 50);
    pipeline.hset(
      `post:${id}:meta`,
      "title",
      `Post number ${i}`,
      "author",
      `@user${i}`
    );
    pipeline.zadd("trending:posts", score, id);
  }
  await pipeline.exec();

  console.log("Seeded 100 posts.");
  redis.quit();
}

seed().catch(console.error);
