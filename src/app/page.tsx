"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { StockSearch } from "@/components/ui/StockSearch";
import { StockCard } from "@/components/ui/StockCard";
import { StockChart } from "@/components/ui/StockChart";
import { useStockData } from "@/hooks/useStockData";

export default function Home() {
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [timeframe, setTimeframe] = useState("5D");
  const {
    data: stockData,
    loading,
    error,
  } = useStockData(selectedStock, timeframe);

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex justify-end items-start p-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center justify-center flex-1 gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-sans">Stock Tracker</h1>
          <div className="w-screen h-0.5 bg-border mt-4 mx-auto" />
        </div>
        <StockSearch onStockSelect={handleStockSelect} />

        {loading && (
          <div className="text-center">
            <p className="text-muted-foreground">Loading stock data...</p>
          </div>
        )}

        {error && (
          <div className="text-center">
            <p className="text-red-500">Error: {error}</p>
          </div>
        )}

        {stockData && (
          <>
            <div className="flex justify-center">
              <StockCard
                symbol={stockData.symbol}
                companyName={`${stockData.symbol} Stock`}
                currentPrice={stockData.currentPrice}
                changePercent={stockData.changePercent}
                changeAmount={stockData.changeAmount}
              />
            </div>
            <div className="w-full max-w-4xl px-4">
              <StockChart
                symbol={stockData.symbol}
                data={stockData.chartData}
                currentPrice={stockData.currentPrice}
                changePercent={stockData.changePercent}
                timeframe={timeframe}
                onTimeframeChange={handleTimeframeChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
