"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const stocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "PG", name: "Procter & Gamble Co." },
  { symbol: "UNH", name: "UnitedHealth Group Inc." },
  { symbol: "HD", name: "The Home Depot Inc." },
  { symbol: "MA", name: "Mastercard Inc." },
  { symbol: "DIS", name: "The Walt Disney Company" },
  { symbol: "PYPL", name: "PayPal Holdings Inc." },
  { symbol: "ADBE", name: "Adobe Inc." },
  { symbol: "CRM", name: "Salesforce Inc." },
  { symbol: "INTC", name: "Intel Corporation" },
];

interface StockSearchProps {
  onStockSelect: (symbol: string) => void;
}

export function StockSearch({ onStockSelect }: StockSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleSelect = (symbol: string) => {
    setValue(symbol);
    setOpen(false);
    onStockSelect(symbol);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value
            ? stocks.find((stock) => stock.symbol === value)?.symbol
            : "Search for a stock..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search stocks..." />
          <CommandList>
            <CommandEmpty>No stock found.</CommandEmpty>
            <CommandGroup>
              {stocks.map((stock) => (
                <CommandItem
                  key={stock.symbol}
                  value={`${stock.symbol} ${stock.name}`}
                  onSelect={() => handleSelect(stock.symbol)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === stock.symbol ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{stock.symbol}</span>
                    <span className="text-sm text-muted-foreground">
                      {stock.name}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
