import { NextResponse } from "next/server";

interface PolygonDataItem {
  t: number;
  c: number;
  o: number;
  h: number;
  l: number;
  v: number;
}

interface PolygonResponse {
  results: PolygonDataItem[];
}

interface ChartDataItem {
  date: string;
  price: number;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "AAPL";
  const timeframe = searchParams.get("timeframe") || "5D";
  
  const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
  
  console.log("API Key available:", !!POLYGON_API_KEY);
  console.log("Symbol:", symbol);
  console.log("Timeframe:", timeframe);
  
  if (!POLYGON_API_KEY) {
    console.error("Polygon API key not found in environment variables");
    return NextResponse.json({ error: "Polygon API key not configured" }, { status: 500 });
  }

  // Helper function to get date range based on timeframe
  const getDateRange = (timeframe: string) => {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0];
    
    switch (timeframe) {
      case "1D":
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          startDate: yesterday.toISOString().split('T')[0],
          endDate,
          multiplier: 5,
          timespan: "minute"
        };
      case "5D":
        const fiveDaysAgo = new Date(now);
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        return {
          startDate: fiveDaysAgo.toISOString().split('T')[0],
          endDate,
          multiplier: 1,
          timespan: "day"
        };
      case "1M":
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return {
          startDate: oneMonthAgo.toISOString().split('T')[0],
          endDate,
          multiplier: 1,
          timespan: "day"
        };
      case "6M":
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return {
          startDate: sixMonthsAgo.toISOString().split('T')[0],
          endDate,
          multiplier: 1,
          timespan: "day"
        };
      case "YTD":
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return {
          startDate: startOfYear.toISOString().split('T')[0],
          endDate,
          multiplier: 1,
          timespan: "day"
        };
      case "1Y":
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return {
          startDate: oneYearAgo.toISOString().split('T')[0],
          endDate,
          multiplier: 1,
          timespan: "day"
        };
      case "5Y":
        const fiveYearsAgo = new Date(now);
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        return {
          startDate: fiveYearsAgo.toISOString().split('T')[0],
          endDate,
          multiplier: 1,
          timespan: "week"
        };
      case "MAX":
        const maxDate = new Date(now);
        maxDate.setFullYear(maxDate.getFullYear() - 10);
        return {
          startDate: maxDate.toISOString().split('T')[0],
          endDate,
          multiplier: 1,
          timespan: "month"
        };
      default:
        return {
          startDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate,
          multiplier: 1,
          timespan: "day"
        };
    }
  };

  try {
    // Get current stock quote
    const quoteUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`;
    console.log("Fetching quote from:", quoteUrl);
    
    const quoteResponse = await fetch(quoteUrl);
    
    console.log("Quote response status:", quoteResponse.status);
    
    if (!quoteResponse.ok) {
      const errorText = await quoteResponse.text();
      console.error("Polygon API error response:", errorText);
      throw new Error(`Polygon API error: ${quoteResponse.status} - ${errorText}`);
    }
    
    const quoteData = await quoteResponse.json() as PolygonResponse;
    console.log("Quote data received:", !!quoteData);
    
    if (!quoteData.results || quoteData.results.length === 0) {
      console.error("No results found for symbol:", symbol);
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }
    
    const latestData = quoteData.results[0];
    console.log("Latest data:", latestData);
    
    // Get historical data for the chart based on timeframe
    const { startDate, endDate, multiplier, timespan } = getDateRange(timeframe);
    const historicalUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${startDate}/${endDate}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`;
    console.log("Fetching historical data from:", historicalUrl);
    
    const historicalResponse = await fetch(historicalUrl);
    
    let chartData: ChartDataItem[] = [];
    if (historicalResponse.ok) {
      const historicalData = await historicalResponse.json() as PolygonResponse;
      if (historicalData.results) {
        chartData = historicalData.results.map((item: PolygonDataItem) => ({
          date: new Date(item.t).toLocaleDateString('en-US', { 
            month: timeframe === "1D" ? undefined : 'short',
            day: timeframe === "1D" ? undefined : 'numeric',
            hour: timeframe === "1D" ? 'numeric' : undefined,
            minute: timeframe === "1D" ? 'numeric' : undefined,
          }),
          price: item.c
        }));
      }
    }
    
    const stockData = {
      symbol: symbol.toUpperCase(),
      currentPrice: latestData.c,
      changePercent: ((latestData.c - latestData.o) / latestData.o) * 100,
      changeAmount: latestData.c - latestData.o,
      open: latestData.o,
      high: latestData.h,
      low: latestData.l,
      volume: latestData.v,
      chartData: chartData,
      timeframe: timeframe
    };
    
    console.log("Returning stock data:", stockData);
    return NextResponse.json(stockData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json({ 
      error: "Failed to fetch stock data", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
