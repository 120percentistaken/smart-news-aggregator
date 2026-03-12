// Next.js helper for sending back responses
import { NextResponse } from "next/server";

// Groq's official SDK — our free AI provider
import Groq from "groq-sdk";

// Our Article type so TypeScript knows the shape of each article
import { type Article } from "@/lib/rss";

// Create one Groq client — it picks up your GROQ_API_KEY from .env.local
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// We define what a topic group looks like after Groq processes it
export type DigestGroup = {
  topic: string;       // The category name e.g. "Rappler"
  briefing: string;    // Groq's 3-sentence summary of the group
  articles: Article[]; // The original articles that belong to this group
};

// This function groups raw articles by their source into named categories
function groupArticles(articles: Article[]): Record<string, Article[]> {
  const groups: Record<string, Article[]> = {};

  for (const article of articles) {
    // If this source hasn't been seen yet, create an empty array for it
    if (!groups[article.source]) {
      groups[article.source] = [];
    }
    // Add the article to its source group
    groups[article.source].push(article);
  }

  return groups;
}

// This function sends a group of articles to Groq and asks for a short briefing
async function generateBriefing(
  topic: string,
  articles: Article[]
): Promise<string> {
  // Only send the first 10 articles to keep the prompt short
  const topArticles = articles.slice(0, 10);

  // Build a simple numbered list of headlines for Groq to read
  const headlines = topArticles
    .map((a, i) => `${i + 1}. ${a.title}`)
    .join("\n");

  // Ask Groq to write a briefing — llama-3.3-70b is free and very capable
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content: "You are a news editor writing concise daily briefings for busy professionals.",
      },
      {
        role: "user",
        content: `Based on these headlines from ${topic}, write a 3-sentence summary of what's happening today.
Be concise, informative, and natural.

Headlines:
${headlines}

Write only the 3-sentence briefing. No intro, no labels, just the briefing.`,
      },
    ],
  });

  // Pull the text out of Groq's response
  return response.choices[0]?.message?.content ?? "No briefing available.";
}

// This is the GET handler — it runs when the frontend calls /api/digest
export async function GET() {
  try {
    // Step 1: Fetch all articles from our RSS feeds
    const { fetchAllFeeds } = await import("@/lib/rss");
    const articles = await fetchAllFeeds();

    // Step 2: Group them by source
    const groups = groupArticles(articles);

    // Step 3: For each group, ask Groq to write a briefing
    const digests: DigestGroup[] = [];

    for (const [topic, topicArticles] of Object.entries(groups)) {
      const briefing = await generateBriefing(topic, topicArticles);
      digests.push({
        topic,
        briefing,
        articles: topicArticles,
      });
    }

    // Step 4: Send everything back to the frontend
    return NextResponse.json({ digests });

  } catch (error) {
    console.error("Digest error:", error);
    return NextResponse.json(
      { error: "Failed to generate digest" },
      { status: 500 }
    );
  }
}