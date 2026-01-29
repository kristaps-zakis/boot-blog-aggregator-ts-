import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds";
import { createPost } from "../lib/db/queries/posts";
import { fetchFeed } from "../lib/rss";
import { parseDuration } from "../lib/time";
import { Feed } from "src/lib/db/schema";


export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }

  const timeArg = args[0];
  const timeBetweenRequests = parseDuration(timeArg);
  if (!timeBetweenRequests) {
    throw new Error(
      `invalid duration: ${timeArg} — use format 1h 30m 15s or 3500ms`,
    );
  }

  console.log(`Collecting feeds every ${timeArg}...`);

  // run the first scrape immediately
  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}


async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log(`No feeds to fetch.`);
    return;
  }
  console.log(`Found a feed to fetch!`);
  await scrapeFeed(feed);
}

async function scrapeFeed(feed: Feed) {
  await markFeedFetched(feed.id);

  const feedData = await fetchFeed(feed.url);

  for (const item of feedData.channel.item) {
    console.log(`Found post: ${item.title}`);

    await createPost({
      url: item.link,
      feedId: feed.id,
      title: item.title,
      description: item.description || null,
      publishedAt: new Date(item.pubDate),
    });
  }

  console.log(
    `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`,
  );
}

function parsePublishedDate(dateStr: string): Date {
  // Try parsing the date string directly
  const date = new Date(dateStr);

  // Check if the date is valid
  if (!isNaN(date.getTime())) {
    return date;
  }

  // If parsing fails, return current date as fallback
  console.warn(`Could not parse date: ${dateStr}, using current time`);
  return new Date();
}

function handleError(err: unknown) {
  console.error(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`,
  );
}