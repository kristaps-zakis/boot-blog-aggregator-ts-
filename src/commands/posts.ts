import { getPostsForUsers } from "../lib/db/queries/posts";
import { User } from "src/lib/db/schema";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
  let limit = 2;

  if (args.length > 0) {
    const parsed = parseInt(args[0], 10);
    if (isNaN(parsed) || parsed < 1) {
      throw new Error(`usage: ${cmdName} [limit]`);
    }
    limit = parsed;
  }

  const posts = await getPostsForUsers(user.id, limit);

  if (posts.length === 0) {
    console.log("No posts found. Follow some feeds and run the aggregator first!");
    return;
  }
  
  for (const { title, url, publishedAt, description, feedName } of posts) {
    console.log(`=== ${title} ===`);
    console.log(`Feed: ${feedName}`);
    console.log(`URL: ${url}`);
    console.log(`Published: ${publishedAt?.toLocaleString()}`);
    if (description) {
      // Truncate description to 200 chars
      const desc = description.length > 200 
        ? description.slice(0, 200) + "..." 
        : description;
      console.log(`Description: ${desc}`);
    }
    console.log();
  }
}
