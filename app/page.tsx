"use client";

import { useEffect, useState } from "react";
import { type DigestGroup } from "./api/digest/route";
import { type ReputationInfo } from "@/lib/reputation";

const reputationStyles: Record<string, { bg: string; text: string; label: string }> = {
  high: { bg: "#1f3a24", text: "#8aab8a", label: "High reliability" },
  mixed: { bg: "#3a3319", text: "#d4b95f", label: "Mixed reliability" },
  low: { bg: "#3a241a", text: "#e07a5f", label: "Low reliability" },
  very_low: { bg: "#3a1a1a", text: "#e05f5f", label: "Very low reliability" },
  satire: { bg: "#2a1f3a", text: "#b39ddb", label: "Satire" },
  unknown: { bg: "#2e2a24", text: "#9a9185", label: "Unrated" },
};

function ReputationBadge({ reputation }: { reputation: ReputationInfo }) {
  const style = reputationStyles[reputation.rating] ?? reputationStyles.unknown;
  return (
    <span
      title={reputation.note}
      style={{
        display: "inline-block",
        fontFamily: "Source Sans 3, sans-serif",
        fontSize: "0.65rem",
        fontWeight: 700,
        letterSpacing: "0.03em",
        padding: "0.15rem 0.5rem",
        borderRadius: "999px",
        background: style.bg,
        color: style.text,
        marginLeft: "0.5rem",
      }}
    >
      {style.label}
    </span>
  );
}

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
              <ReputationBadge reputation={article.reputation} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function FeedbackBox() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit() {
    if (!message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, email }),
      });
      if (res.ok) {
        setStatus("sent");
        setMessage("");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.cardBorder}`,
        borderTop: "4px solid #9a9185",
        borderRadius: "4px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "1.2rem",
          fontWeight: 700,
          color: theme.textPrimary,
          margin: "0 0 0.4rem",
        }}
      >
        Share your feedback
      </h2>
      <p
        style={{
          fontFamily: "Source Sans 3, sans-serif",
          fontSize: "0.82rem",
          color: theme.textSecondary,
          margin: "0 0 1.25rem",
        }}
      >
        Got a suggestion or found something broken? Let us know.
      </p>

      {/* Email input */}
      <input
        type="email"
        placeholder="Your email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          background: theme.bg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: "4px",
          padding: "0.65rem 0.9rem",
          color: theme.textPrimary,
          fontFamily: "Source Sans 3, sans-serif",
          fontSize: "0.85rem",
          marginBottom: "0.75rem",
          boxSizing: "border-box",
          outline: "none",
        }}
      />

      {/* Message textarea */}
      <textarea
        placeholder="Write your feedback here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          background: theme.bg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: "4px",
          padding: "0.65rem 0.9rem",
          color: theme.textPrimary,
          fontFamily: "Source Sans 3, sans-serif",
          fontSize: "0.85rem",
          resize: "vertical",
          marginBottom: "1rem",
          boxSizing: "border-box",
          outline: "none",
        }}
      />

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={status === "sending" || !message.trim()}
        style={{
          background: theme.button,
          color: theme.buttonText,
          border: "none",
          padding: "0.55rem 1.5rem",
          borderRadius: "4px",
          cursor: status === "sending" || !message.trim() ? "not-allowed" : "pointer",
          fontFamily: "Source Sans 3, sans-serif",
          fontSize: "0.82rem",
          fontWeight: 700,
          opacity: status === "sending" || !message.trim() ? 0.5 : 1,
          letterSpacing: "0.05em",
        }}
      >
        {status === "sending" ? "Sending..." : "Send Feedback"}
      </button>

      {/* Success message */}
      {status === "sent" && (
        <p
          style={{
            marginTop: "0.75rem",
            color: "#8aab8a",
            fontFamily: "Source Sans 3, sans-serif",
            fontSize: "0.82rem",
          }}
        >
          ✓ Thanks for your feedback!
        </p>
      )}

      {/* Error message */}
      {status === "error" && (
        <p
          style={{
            marginTop: "0.75rem",
            color: "#e07a5f",
            fontFamily: "Source Sans 3, sans-serif",
            fontSize: "0.82rem",
          }}
        >
          Something went wrong. Please try again.
        </p>
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

        {/* Feedback */}
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 2rem 2rem" }}>
          <FeedbackBox />
        </div>

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