import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useSimulation } from "@/context/SimulationContext";
import {
  formatMoney,
  getTrendingQuotes,
  portfolioDayChangeCents,
  portfolioGainCents,
  portfolioGainPercent,
  portfolioValueCents,
  stockDayChangeCents,
  stockDayChangePercent,
} from "@fenix/domain";

export default function StockMarket() {
  const navigate = useNavigate();
  const { world, isLoading } = useSimulation();

  const portfolioView = useMemo(() => {
    if (!world) {
      return null;
    }

    const { portfolio } = world;
    const currency = world.origin.currency;
    const quotesBySymbol = new Map(portfolio.quotes.map((quote) => [quote.symbol, quote]));
    const portfolioValue = portfolioValueCents(portfolio.holdings, portfolio.quotes);
    const dayChange = portfolioDayChangeCents(portfolio.holdings, portfolio.quotes);
    const dayChangePct =
      portfolioValue > 0 ? Number(((dayChange / portfolioValue) * 100).toFixed(2)) : 0;

    const holdings = portfolio.holdings
      .map((holding) => {
        const quote = quotesBySymbol.get(holding.symbol);
        if (!quote) {
          return null;
        }

        const valueCents = holding.shares * quote.priceCents;
        const changeCents = stockDayChangeCents(quote);
        const changePercent = stockDayChangePercent(quote);

        return {
          symbol: holding.symbol,
          name: quote.name,
          logo: quote.logo,
          price: quote.priceCents / 100,
          change: changeCents / 100,
          changePercent,
          shares: holding.shares,
          value: valueCents / 100,
        };
      })
      .filter((holding) => holding !== null);

    const portfolioData = portfolio.history.map((point, index) => ({
      date: index === portfolio.history.length - 1 ? "Now" : `D-${portfolio.history.length - index - 1}`,
      value: point.valueCents / 100,
    }));

    const trending = getTrendingQuotes(portfolio.quotes).map((quote) => ({
      symbol: quote.symbol,
      name: quote.name,
      change: stockDayChangePercent(quote),
      logo: quote.logo,
    }));

    return {
      currency,
      portfolioValue,
      dayChange,
      dayChangePct,
      totalGain: portfolioGainCents(portfolio),
      gainPercent: portfolioGainPercent(portfolio),
      holdingsCount: portfolio.holdings.length,
      dividendsYtd: portfolio.dividendsYtdCents,
      holdings,
      portfolioData,
      trending,
    };
  }, [world]);

  if (isLoading || !world || !portfolioView) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] text-[#1C2541]">
        Loading portfolio…
      </div>
    );
  }

  const {
    currency,
    portfolioValue,
    dayChange,
    dayChangePct,
    totalGain,
    gainPercent,
    holdingsCount,
    dividendsYtd,
    holdings,
    portfolioData,
    trending,
  } = portfolioView;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMHRyYWRpbmclMjBmbG9vcnxlbnwxfHx8fDE3ODM3MDY3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Stock market trading"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B132B]/80 to-[#1C2541]/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <Button
              variant="ghost"
              onClick={() => navigate("/home")}
              className="text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl text-white mb-2">Stock Market</h1>
                <p className="text-gray-300">Investment Portfolio · Tech index {world.economy.techSectorIndex.toFixed(1)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">Portfolio Value</p>
                <p className="text-3xl text-[#2EC4B6]">{formatMoney(portfolioValue, currency)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Card className="mb-6 border-[#2EC4B6]/20 shadow-xl bg-gradient-to-br from-[#1C2541] to-[#0B132B] text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-sm text-gray-300 mb-2">Portfolio Value</div>
                <div className="text-4xl mb-2">{formatMoney(portfolioValue, currency)}</div>
                <div className={`flex items-center gap-2 ${dayChange >= 0 ? "text-[#2EC4B6]" : "text-red-300"}`}>
                  {dayChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm">
                    {dayChange >= 0 ? "+" : ""}
                    {formatMoney(dayChange, currency)} today ({dayChangePct >= 0 ? "+" : ""}
                    {dayChangePct}%)
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Total Gain</div>
                <div className={`text-3xl ${totalGain >= 0 ? "text-[#2EC4B6]" : "text-red-300"}`}>
                  {totalGain >= 0 ? "+" : ""}
                  {formatMoney(totalGain, currency)}
                </div>
                <div className="text-sm text-gray-400">
                  {gainPercent >= 0 ? "+" : ""}
                  {gainPercent}% all time
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Holdings</div>
                <div className="text-3xl">{holdingsCount}</div>
                <div className="text-sm text-gray-400">Stocks</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Dividends (YTD)</div>
                <div className="text-3xl text-[#F4B400]">{formatMoney(dividendsYtd, currency)}</div>
                <div className="text-sm text-gray-400">Accrued in simulation</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={portfolioData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2EC4B6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2EC4B6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#2EC4B6" strokeWidth={3} fill="url(#colorValue)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-[#F4B400]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Trending Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trending.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="p-4 rounded-lg bg-gradient-to-r from-[#2EC4B6]/10 to-transparent"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{stock.logo}</div>
                        <div>
                          <div className="text-[#1C2541]">{stock.symbol}</div>
                          <div className="text-xs text-gray-500">{stock.name}</div>
                        </div>
                      </div>
                      <Badge className="bg-[#2EC4B6]/20 text-[#2EC4B6] border-[#2EC4B6]/30">
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change}%
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button className="w-full bg-[#F4B400] hover:bg-[#d69f00] text-white" disabled>
                  Explore Market
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1C2541]">Your Holdings</CardTitle>
                <Button className="bg-gradient-to-r from-[#2EC4B6] to-[#1C9B8F] text-white" disabled>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Buy Stocks
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {holdings.map((stock) => (
                  <Card key={stock.symbol} className="border-gray-200">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{stock.logo}</div>
                          <div>
                            <div className="text-lg text-[#1C2541]">{stock.symbol}</div>
                            <div className="text-xs text-gray-500">{stock.name}</div>
                          </div>
                        </div>
                        {stock.change >= 0 ? (
                          <TrendingUp className="w-5 h-5 text-[#2EC4B6]" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Price</span>
                          <span className="text-[#1C2541]">{formatMoney(stock.price * 100, currency)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Change</span>
                          <span className={stock.change >= 0 ? "text-[#2EC4B6]" : "text-red-400"}>
                            {stock.change >= 0 ? "+" : ""}
                            {formatMoney(stock.change * 100, currency)} ({stock.changePercent}%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                          <span className="text-sm text-gray-600">Your Value</span>
                          <span className="text-[#1C2541]">{formatMoney(stock.value * 100, currency)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Shares</span>
                          <span className="text-gray-500">{stock.shares}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="flex-1 bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white" disabled>
                          Buy
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" disabled>
                          Sell
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
