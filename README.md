# 📰 The Dayly Brip

A smart, AI-powered news aggregator that pulls live articles from multiple RSS feeds and generates concise daily briefings using Groq AI. Built as a portfolio project to demonstrate full-stack development with Next.js and AI API integration.

---

## 🚀 Live Demo

[View Live Site]

---

## ✨ Features

- Fetches live articles from RSS feeds (Philippines, US News, Gaming)
- AI-generated 3-sentence briefings per news category using Groq (LLaMA 3.3)
- Clean, readable editorial UI with a warm dark theme
- One-click refresh to pull the latest news on demand
- Fully responsive — works on mobile and desktop

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **AI:** Groq API — LLaMA 3.3 70B
- **RSS Parsing:** rss-parser
- **Styling:** Inline styles with custom warm midnight theme
- **Deployment:** Vercel

---

## 📦 Getting Started

### Prerequisites
- Node.js v18+
- A free Groq API key from [console.groq.com](https://console.groq.com)

### Installation

1. Clone the repository
```bash
   git clone https://github.com/YOUR_USERNAME/smart-news-aggregator.git
   cd smart-news-aggregator
```

2. Install dependencies
```bash
   npm install
```

3. Create a `.env.local` file in the root and add your Groq API key
```
   GROQ_API_KEY=your_groq_key_here
```

4. Run the development server
```bash
   npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 📡 RSS Feeds

| Source | Category |
|--------|----------|
| Rappler | 🇵🇭 Philippines |
| NPR News | 🇺🇸 United States |
| PC Gamer | 🎮 Gaming |

---

## 🧠 How It Works

1. The frontend calls `/api/digest` on page load
2. The API route fetches all RSS feeds simultaneously using `Promise.allSettled`
3. Articles are grouped by source
4. Each group is sent to Groq AI with a prompt to generate a 3-sentence briefing
5. The frontend renders the briefings and article lists as digest cards

---

## 📁 Project Structure
```
smart-news-aggregator/
├── app/
│   ├── api/
│   │   ├── digest/route.ts    # AI digest engine
│   │   └── feeds/route.ts     # Raw RSS feed endpoint
│   ├── layout.tsx             # App layout and metadata
│   └── page.tsx               # Main dashboard UI
├── lib/
│   └── rss.ts                 # RSS fetcher and parser
└── .env.local                 # API keys (not committed)
```

---

## 🔮 Future Plans

- [ ] Add email newsletter subscription
- [ ] Add more RSS feed sources
- [ ] Add category filtering
- [ ] Add article search
- [ ] Dark/light mode toggle

---
