import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { feeds } from "../schema";
import { firstOrUndefined } from "./utils";


// export async function createFeedd(name: string, url: string, userId: string) {
//   try {
//     const [result] = await db.insert(feeds).values({ name: name, url: url, user_id: userId }).returning();
//     return result;
//   } catch (error: any) {
//     console.error(`Error creating feed ${name}:`);
//     throw error;
//   }
// }

export async function createFeed(
  feedName: string,
  url: string,
  userId: string,
) {
  const result = await db
    .insert(feeds)
    .values({
      name: feedName,
      url,
      userId,
    })
    .returning();

  return firstOrUndefined(result);
}

export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

// export async function createFeedFollow(feedId: string, userId: string) {
//   try {
//     const [newFeedFollow] = await db.insert(feed_follows).values({ feed_id: feedId, user_id: userId }).returning();

//     const result = await db
//       .select()
//       .from(feed_follows)
//       .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
//       .innerJoin(users, eq(feed_follows.user_id, users.id))
//       .where(eq(feed_follows.id, newFeedFollow.id));

//     return result[0];
//   } catch (error: any) {
//     console.error(`Error creating feed follow ${feedId} for user ${userId}:`);
//     throw error;
//   }
// }

export async function getFeedByUrl(url: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));
  return firstOrUndefined(result);
}

// export async function getFeedFollowsForUser(userId: string) {
//   return await db
//     .select({
//       feedFollow: feed_follows,
//       feedName: feeds.name,
//       userName: users.name,
//     })
//     .from(feed_follows)
//     .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
//     .innerJoin(users, eq(feed_follows.user_id, users.id))
//     .where(eq(feed_follows.user_id, userId));
// }

export async function markFeedFetched(feedId: string) {
  const result = await db
    .update(feeds)
    .set({
      lastFetchedAt: new Date(),
    })
    .where(eq(feeds.id, feedId))
    .returning();
  return firstOrUndefined(result);
}

export async function getNextFeedToFetch() {
  const result = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} asc nulls first`)
    .limit(1);
  return firstOrUndefined(result);
}