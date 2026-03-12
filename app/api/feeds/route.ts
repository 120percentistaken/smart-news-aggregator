// Pull in our fetcher function from the lib folder
import { fetchAllFeeds } from "@/lib/rss";

// Next.js gives us NextResponse to make sending back data nice and clean
import { NextResponse } from "next/server";

// Anything in a route.ts file automatically becomes an API endpoint
// This one handles GET requests at /api/feeds
export async function GET() {
  try {
    // Go grab all the articles from our feeds
    const articles = await fetchAllFeeds();

    // Send them back as JSON so the frontend can use them
    return NextResponse.json({ articles });

  } catch (error) {
    // Something went wrong on our end — let the caller know
    return NextResponse.json(
      { error: "Failed to fetch feeds" },
      { status: 500 }
    );
  }
}