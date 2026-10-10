import redis from "./redis.js";
import { upvote, getTop } from "./leaderboard.js";

async function runTest() {
  const target = "post:50";

  for (let i = 0; i < 50; i++) {
    await upvote(target);
  }

  const top10 = await getTop(10);
  
  console.log("Top 10:");
  top10.forEach((post, index) => {
    console.log(`  #${index + 1}  ${post.id}  score=${post.score}  ${post.title} (${post.author})`);
  });

  const targetInTop10 = top10.some(p => p.id === target);

  if (targetInTop10) {
    console.log(`PASS  ${target} reached the top 10`);
    redis.quit();
    process.exit(0);
  } else {
    console.error(`FAIL  ${target} did not reach the top 10`);
    redis.quit();
    process.exit(1);
  }
}

runTest().catch(console.error);
