Stock Trader App

# Tech Stack

Framework: Next.js
Lanagugae: TypeScript
Styling: Tailwind CSS
UI Components: Shadcn/ui & Tweakcn for theme
Database: Supabase
Deployment: Vercel

# Dependencies

npx shadcn@latest init
npm install next-themes

# File Structure

app/
layout.tsx # global layout w/ Tailwind + Shadcn theme
page.tsx # dashboard homepage (search + stock cards)
api/
stock/route.ts # serverless API route → fetch stock data
components/
StockCard.tsx # card UI for each stock
StockSearch.tsx # search bar
StockChart.tsx # mini chart (sparkline)
lib/
supabase.ts # Supabase client setup
fetchStock.ts # helper to fetch from finance API

# UI Components

- Searchbar
- Stock Card
- Charts

# APIs

Polygon API
