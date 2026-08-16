// lib/reputation.ts
//
// A small, free, offline source-reputation lookup.
// No API calls — just matches an article's domain against a curated list.
//
// IMPORTANT: this is a starter list for prototyping, not an authoritative
// or scientific rating. Expand it yourself or swap in a licensed dataset
// (NewsGuard, Ad Fontes) before using this for anything beyond your own testing.

export type ReputationRating =
  | "high"
  | "mixed"
  | "low"
  | "very_low"
  | "satire"
  | "unknown";

export type ReputationInfo = {
  rating: ReputationRating;
  note: string;
};

const REPUTATION_TABLE: Record<string, ReputationInfo> = {
  "reuters.com": { rating: "high", note: "Wire service, editorial standards, minimal opinion in news desk." },
  "apnews.com": { rating: "high", note: "Wire service, similar standards to Reuters." },
  "bbc.com": { rating: "high", note: "Public broadcaster, established editorial standards." },
  "npr.org": { rating: "high", note: "Public broadcaster, established editorial standards." },
  "nytimes.com": { rating: "high", note: "Established editorial standards; opinion section separate from news desk." },
  "wsj.com": { rating: "high", note: "Established editorial standards; opinion section separate from news desk." },
  "washingtonpost.com": { rating: "high", note: "Established editorial standards; opinion section separate from news desk." },
  "theguardian.com": { rating: "high", note: "Established editorial standards." },
  "economist.com": { rating: "high", note: "Established editorial standards, analysis-heavy." },
  "propublica.org": { rating: "high", note: "Nonprofit investigative journalism, high sourcing standards." },
  "rappler.com": { rating: "high", note: "Established Philippine outlet, investigative focus." },
  "inquirer.net": { rating: "mixed", note: "Mainstream Philippine outlet, generally factual reporting." },
  "gmanetwork.com": { rating: "high", note: "Established Philippine broadcaster/news outlet." },
  "cnn.com": { rating: "mixed", note: "Generally factual reporting; has drawn criticism for sensationalism at times." },
  "foxnews.com": { rating: "mixed", note: "News desk generally factual; opinion programming often blurs the line for viewers." },
  "nypost.com": { rating: "mixed", note: "Tabloid style; mix of solid reporting and sensationalized framing." },
  "dailymail.co.uk": { rating: "low", note: "History of unverified claims and sensationalized headlines." },
  "breitbart.com": { rating: "low", note: "Strong ideological slant; history of misleading framing flagged by fact-checkers." },
  "infowars.com": { rating: "very_low", note: "Long history of publishing debunked conspiracy claims." },
  "theonion.com": { rating: "satire", note: "Satire publication, not intended as factual news." },
  "babylonbee.com": { rating: "satire", note: "Satire publication, not intended as factual news." },
};

export function extractDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function getReputation(url: string): ReputationInfo {
  const domain = extractDomain(url);
  if (!domain) {
    return { rating: "unknown", note: "Could not parse source URL." };
  }
  return (
    REPUTATION_TABLE[domain] ?? {
      rating: "unknown",
      note: "No data for this domain in the starter list.",
    }
  );
}