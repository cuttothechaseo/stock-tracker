"use client";

import { useState, useEffect } from "react";

interface StockData {
  symbol: string;
  currentPrice: number;
  changePercent: number;
  changeAmount: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  chartData: Array<{
    date: string;
    price: number;
  }>;
  timeframe: string;
}

export function useStockData(symbol: string, timeframe: string = "5D") {
  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const fetchStockData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/stock?symbol=${symbol}&timeframe=${timeframe}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
        }
        
        const stockData = await response.json();
        
        if (stockData.error) {
          throw new Error(stockData.error);
        }
        
        setData(stockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
        console.error('Error fetching stock data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol, timeframe]);

  return { data, loading, error };
}
