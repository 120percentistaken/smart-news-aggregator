"use client";

import { useEffect, useState } from "react";
import { type DigestGroup } from "./api/digest/route";

const theme = {
  bg: "#1a1410",
  card: "#242018",
  cardBorder: "#2e2a24",
  textPrimary: "#f0ece4",
  textSecondary: "#9a9185",
  textLink: "#e8e0d0",
  button: "#f0ece4",
  buttonText: "#1a1410",
};

const topicMeta: Record<string, { icon: string; color: string; label: string }> = {
  Rappler: { icon: "🇵🇭", color: "#e07a5f", label: "Philippines" },
  "NPR News": { icon: "🇺🇸", color: "#7eb8c9", label: "United States" },
  "PC Gamer": { icon: "🎮", color: "#8aab8a", label: "Gaming" },
};

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function DigestCard({ digest }: { digest: DigestGroup }) {
  const [open, setOpen] = useState(false);
  const meta = topicMeta[digest.topic] ?? {
    icon: "📰",
    color: "#9a9185",
    label: digest.topic,
  };

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.cardBorder}`,
        borderTop: `4px solid ${meta.color}`,
        borderRadius: "4px",
        marginBottom: "1.5rem",
        overflow: "hidden",
      }}
    >
      {/* Card Header */}
      <div style={{ padding: "1.25rem 1.5rem 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>{meta.icon}</span>
          <span
            style={{
              fontFamily: "Source Sans 3, sans-serif",
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              color: meta.color,
              textTransform: "uppercase",
            }}
          >
            {meta.label}
          </span>
          <span
            style={{
              fontFamily: "Source Sans 3, sans-serif",
              fontSize: "0.7rem",
              color: theme.textSecondary,
              marginLeft: "auto",
            }}
          >
            {digest.articles.length} stories
          </span>
        </div>

        {/* AI Briefing */}
        <p
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1rem",
            lineHeight: 1.85,
            color: theme.textPrimary,
            margin: "0 0 1.25rem",
          }}
        >
          {digest.briefing}
        </p>
      </div>

      {/* Toggle */}
      <div
        style={{
          borderTop: `1px solid ${theme.cardBorder}`,
          padding: "0.75rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "Source Sans 3, sans-serif",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: meta.color,
            padding: 0,
            letterSpacing: "0.05em",
          }}
        >
          {open ? "Hide stories ↑" : "Read stories ↓"}
        </button>
      </div>

      {/* Article List */}
      {open && (
        <div style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
          {digest.articles.map((article, i) => (
            <a
              key={i}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                padding: "0.85rem 1.5rem",
                borderBottom:
                  i < digest.articles.length - 1
                    ? `1px solid ${theme.cardBorder}`
                    : "none",
                textDecoration: "none",
                color: theme.textLink,
                fontFamily: "Source Sans 3, sans-serif",
                fontSize: "0.88rem",
                lineHeight: 1.55,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#2e2a24")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "")
              }
            >
              <span
                style={{
                  color: meta.color,
                  marginRight: "0.5rem",
                  fontSize: "0.7rem",
                }}
              >
                ●
              </span>
              {article.title.trim()}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [digests, setDigests] = useState<DigestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  async function loadDigests() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/digest");
      const data = await res.json();
      if (data.digests) {
        setDigests(data.digests);
        setLastUpdated(
          new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDigests();
  }, []);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@300;400;600;700&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          background: theme.bg,
          minHeight: "100vh",
          fontFamily: "Source Sans 3, sans-serif",
        }}
      >
        {/* Header */}
        <header
          style={{
            background: theme.card,
            borderBottom: `1px solid ${theme.cardBorder}`,
            padding: "1.5rem 2rem",
          }}
        >
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "Source Sans 3, sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.25em",
                color: theme.textSecondary,
                margin: "0 0 0.4rem",
                textTransform: "uppercase",
              }}
            >
              {formatDate()}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <h1
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "2.2rem",
                  fontWeight: 900,
                  margin: 0,
                  color: theme.textPrimary,
                  letterSpacing: "-0.02em",
                }}
              >
                The Dayly Brip
              </h1>
              <button
                onClick={loadDigests}
                disabled={loading}
                style={{
                  background: theme.button,
                  color: theme.buttonText,
                  border: "none",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "Source Sans 3, sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  opacity: loading ? 0.5 : 1,
                  letterSpacing: "0.05em",
                }}
              >
                {loading ? "Refreshing..." : "↻ Refresh"}
              </button>
            </div>
            <p
              style={{
                fontFamily: "Source Sans 3, sans-serif",
                fontSize: "0.8rem",
                color: theme.textSecondary,
                margin: "0.4rem 0 0",
              }}
            >
              AI-powered digest from the Philippines, US, and Gaming world.
              {lastUpdated && ` Last updated at ${lastUpdated}.`}
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem" }}>
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 0",
                color: theme.textSecondary,
                fontFamily: "Source Sans 3, sans-serif",
                fontSize: "0.9rem",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
                📰
              </div>
              Fetching latest news and generating AI briefings...
              <br />
              <span style={{ fontSize: "0.8rem", color: "#6a6258" }}>
                This takes about 10 seconds
              </span>
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#2e1a18",
                border: "1px solid #5a2a24",
                borderRadius: "4px",
                padding: "1.25rem 1.5rem",
                color: "#e07a5f",
                fontFamily: "Source Sans 3, sans-serif",
                fontSize: "0.88rem",
              }}
            >
              Something went wrong while fetching the digest. Please try
              refreshing.
            </div>
          )}

          {!loading && !error && digests.map((digest, i) => (
            <DigestCard key={i} digest={digest} />
          ))}
        </main>

        {/* Footer */}
        <footer
          style={{
            borderTop: `1px solid ${theme.cardBorder}`,
            padding: "1.5rem 2rem",
            textAlign: "center",
            fontFamily: "Source Sans 3, sans-serif",
            fontSize: "0.75rem",
            color: theme.textSecondary,
          }}
        >
          Built with Next.js · Groq AI · RSS Feeds
        </footer>
      </div>
    </>
  );
}