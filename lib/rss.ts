// We're using rss-parser to do the heavy lifting of reading RSS feeds for us
import Parser from "rss-parser";

// One parser is enough for everything we need
const parser = new Parser();

// These are the news sources we want to pull articles from
// Feel free to swap these out or add more later
export const FEEDS = [
{ name: "Rappler", url: "https://www.rappler.com/feed/" },
{ name: "NPR News", url: "https://feeds.npr.org/1001/rss.xml" },
{ name: "PC Gamer", url: "https://www.pcgamer.com/rss/" },

];

// Think of this as a blueprint for what every article looks like in our app
export type Article = {
  title: string;    // The headline
  link: string;     // Where to read the full article
  summary: string;  // A short preview of what it's about
  date: string;     // When it was posted
  source: string;   // Which site it came from
};

// This is the main function — it grabs articles from all feeds and returns them as one big list
export async function fetchAllFeeds(): Promise<Article[]> {

  // We fetch all feeds at the same time instead of waiting for each one to finish
  // If one feed breaks or goes down, the others still load fine
  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const parsed = await parser.parseURL(feed.url);

      // Reshape each article so it matches our Article type above
      return parsed.items.map((item) => ({
        title: item.title ?? "No title",
        link: item.link ?? "",
        summary: item.contentSnippet ?? item.content ?? "",
        date: item.pubDate ?? "",
        source: feed.name, // So we know later which site this came from
      }));
    })
  );

  const articles: Article[] = [];

  // Go through each feed result and only keep the ones that actually worked
  for (const result of results) {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    }
  }

  // Hand back everything we collected
  return articles;
}