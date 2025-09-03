"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StockChartData {
  date: string;
  price: number;
}

interface StockChartProps {
  symbol: string;
  data: StockChartData[];
  currentPrice: number;
  changePercent: number;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

const timeframes = [
  { value: "1D", label: "1D" },
  { value: "5D", label: "5D" },
  { value: "1M", label: "1M" },
  { value: "6M", label: "6M" },
  { value: "YTD", label: "YTD" },
  { value: "1Y", label: "1Y" },
  { value: "5Y", label: "5Y" },
  { value: "MAX", label: "MAX" },
];

export function StockChart({
  symbol,
  data,
  currentPrice,
  changePercent,
  timeframe,
  onTimeframeChange,
}: StockChartProps) {
  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary font-bold">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{symbol}</CardTitle>
            <p className="text-muted-foreground">Stock Price Chart</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={isPositive ? "default" : "destructive"}
              className={`flex items-center gap-1 ${
                isPositive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isPositive && <TrendingUp className="h-3 w-3" />}
              {isNegative && <TrendingDown className="h-3 w-3" />}
              {Math.abs(changePercent).toFixed(2)}%
            </Badge>
            <span className="text-lg font-bold">
              {formatPrice(currentPrice)}
            </span>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <ToggleGroup
            type="single"
            value={timeframe}
            onValueChange={(value) => {
              if (value) onTimeframeChange(value);
            }}
            className="bg-muted rounded-lg p-1"
          >
            {timeframes.map((tf) => (
              <ToggleGroupItem
                key={tf.value}
                value={tf.value}
                className="px-3 py-1 text-sm data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=off]:text-muted-foreground"
              >
                {tf.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs text-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                className="text-xs text-muted-foreground"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#22c55e" : "#ef4444"}
                strokeWidth={2}
                dot={{
                  fill: isPositive ? "#22c55e" : "#ef4444",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  stroke: isPositive ? "#22c55e" : "#ef4444",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
