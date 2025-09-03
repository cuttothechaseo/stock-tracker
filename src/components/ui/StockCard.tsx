import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StockCardProps {
  symbol: string;
  companyName: string;
  currentPrice: number;
  changePercent: number;
  changeAmount: number;
}

export function StockCard({
  symbol,
  companyName,
  currentPrice,
  changePercent,
  changeAmount,
}: StockCardProps) {
  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;
  const isNeutral = changePercent === 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(Math.abs(change));
  };

  return (
    <Card className="w-[300px] hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{symbol}</CardTitle>
          <Badge
            variant={
              isPositive ? "default" : isNegative ? "destructive" : "secondary"
            }
            className={`flex items-center gap-1 ${
              isPositive
                ? "bg-green-100 text-green-800"
                : isNegative
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            {isNeutral && <Minus className="h-3 w-3" />}
            {Math.abs(changePercent).toFixed(2)}%
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{companyName}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">{formatPrice(currentPrice)}</div>
          <div
            className={`text-sm ${
              isPositive
                ? "text-green-600"
                : isNegative
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {isPositive ? "+" : isNegative ? "-" : ""}
            {formatChange(changeAmount)} ({Math.abs(changePercent).toFixed(2)}%)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
