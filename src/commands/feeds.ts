// import { createFeed, getFeedByUrl, getFeedsList } from "../lib/db/queries/feeds";
import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import { getUserById } from "../lib/db/queries/users";
// import { getUserById } from "../lib/db/queries/users";

// import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feed-follows";
import { createFeedFollow } from "src/lib/db/queries/feed-follows";
import { printFeedFollow } from "./feed-follows";


import { Feed, User } from "src/lib/db/schema";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <url>`);
  }

  const feedName = args[0];
  const url = args[1];

  const feed = await createFeed(feedName, url, user.id);
  if (!feed) {
    throw new Error(`Failed to create feed`);
  }

  // Automatically follow the feed
  const feedFollow = await createFeedFollow(user.id, feed.id);

  printFeedFollow(user.name, feedFollow.feedName);

  console.log("Feed created successfully:");
  printFeed(feed, user);

//   if (!feedFollow) {
//     throw new Error(`Failed to follow feed`);
//   }

//   console.log("Feed created and followed successfully:");
//   console.log(`* Feed: ${feedFollow.feedName}`);
//   console.log(`* User: ${feedFollow.userName}`);
}

// export async function handlerGetFeeds(cmdName: string, ...args: string[]) {
//     const feeds = await getFeedsList();
//         if (!feeds) {
//             throw new Error(`Failed to get feeds`);
//     }

//     for (const feed of feeds) {
//         console.log(`name: ${feed.feeds.name}, url: ${feed.feeds.url}, user: ${feed.users?.name ?? "unknown"}`);
//     }
// }

function printFeed(feed: Feed, user: User) {
    console.log(`* ID:            ${feed.id}`);
    console.log(`* Created:       ${feed.createdAt}`);
    console.log(`* Updated:       ${feed.updatedAt}`);
    console.log(`* name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* User:          ${user.name}`);
  }
  
  export async function handlerListFeeds(_: string) {
    const feeds = await getFeeds();
  
    if (feeds.length === 0) {
      console.log(`No feeds found.`);
      return;
    }
  
    console.log(`Found %d feeds:\n`, feeds.length);
    for (let feed of feeds) {
      const user = await getUserById(feed.userId);
      if (!user) {
        throw new Error(`Failed to find user for feed ${feed.id}`);
      }
  
      printFeed(feed, user);
      console.log(`=====================================`);
    }
  }

// export async function handlerFollowFeed(cmdName: string, user: User, ...args: string[]) {
//   if (args.length !== 1) {
//     throw new Error(`usage: ${cmdName} <url>`);
//   }

//   const url = args[0];

//   const feed = await getFeedByUrl(url);
//   if (!feed) {
//     throw new Error(`Feed with URL ${url} not found`);
//   }

//   const feedFollow = await createFeedFollow(feed.id, user.id);
//   if (!feedFollow) {
//     throw new Error(`Failed to follow feed`);
//   }

//   console.log("Feed followed successfully:");
//   console.log(`* Feed: ${feedFollow.feedName}`);
//   console.log(`* User: ${feedFollow.userName}`);
// }

// export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
//   const feedFollows = await getFeedFollowsForUser(user.id);

//   if (feedFollows.length === 0) {
//     console.log("You are not following any feeds.");
//     return;
//   }

//   console.log(`Feeds followed by ${user.name}:`);
//   for (const follow of feedFollows) {
//     console.log(`* ${follow.feedname}`);
//   }
// }
