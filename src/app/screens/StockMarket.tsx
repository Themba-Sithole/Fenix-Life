import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function StockMarket() {
  const navigate = useNavigate();

  const portfolioData = [
    { date: "Mon", value: 420000 },
    { date: "Tue", value: 435000 },
    { date: "Wed", value: 448000 },
    { date: "Thu", value: 465000 },
    { date: "Fri", value: 485000 },
  ];

  const stocks = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 182.45,
      change: 2.35,
      changePercent: 1.31,
      shares: 250,
      value: 45612,
      logo: "🍎",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 138.92,
      change: -1.24,
      changePercent: -0.88,
      shares: 180,
      value: 25006,
      logo: "🔍",
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: 265.78,
      change: 5.67,
      changePercent: 2.18,
      shares: 150,
      value: 39867,
      logo: "⚡",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: 378.25,
      change: 3.12,
      changePercent: 0.83,
      shares: 200,
      value: 75650,
      logo: "💻",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      price: 145.89,
      change: -0.95,
      changePercent: -0.65,
      shares: 300,
      value: 43767,
      logo: "📦",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      price: 498.32,
      change: 12.45,
      changePercent: 2.56,
      shares: 100,
      value: 49832,
      logo: "🎮",
    },
  ];

  const trending = [
    { symbol: "META", name: "Meta Platforms", change: 4.23, logo: "👤" },
    { symbol: "NFLX", name: "Netflix", change: 3.18, logo: "🎬" },
    { symbol: "AMD", name: "AMD", change: 2.95, logo: "💾" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
      {/* Hero Header with Image */}
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
                <p className="text-gray-300">Investment Portfolio</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">Portfolio Value</p>
                <p className="text-3xl text-[#2EC4B6]">$485,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Portfolio Summary */}
        <Card className="mb-6 border-[#2EC4B6]/20 shadow-xl bg-gradient-to-br from-[#1C2541] to-[#0B132B] text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-sm text-gray-300 mb-2">Portfolio Value</div>
                <div className="text-4xl mb-2">$485,000</div>
                <div className="flex items-center gap-2 text-[#2EC4B6]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+$15,420 today (+3.2%)</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Total Gain</div>
                <div className="text-3xl text-[#2EC4B6]">+$85,234</div>
                <div className="text-sm text-gray-400">+21.3% all time</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Holdings</div>
                <div className="text-3xl">12</div>
                <div className="text-sm text-gray-400">Stocks</div>
              </div>
              <div>
                <div className="text-sm text-gray-300 mb-2">Dividends (YTD)</div>
                <div className="text-3xl text-[#F4B400]">$4,250</div>
                <div className="text-sm text-gray-400">Monthly avg: $708</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Portfolio Performance Chart */}
          <Card className="lg:col-span-2 border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1C2541]">Portfolio Performance</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs">1D</Button>
                  <Button size="sm" className="bg-[#2EC4B6] text-white text-xs">1W</Button>
                  <Button size="sm" variant="outline" className="text-xs">1M</Button>
                  <Button size="sm" variant="outline" className="text-xs">1Y</Button>
                </div>
              </div>
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

          {/* Trending Stocks */}
          <Card className="border-[#F4B400]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Trending Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trending.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="p-4 rounded-lg bg-gradient-to-r from-[#2EC4B6]/10 to-transparent hover:from-[#2EC4B6]/20 transition-all cursor-pointer"
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
                        +{stock.change}%
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button className="w-full bg-[#F4B400] hover:bg-[#d69f00] text-white">
                  Explore Market
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Holdings */}
          <Card className="lg:col-span-3 border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#1C2541]">Your Holdings</CardTitle>
                <Button className="bg-gradient-to-r from-[#2EC4B6] to-[#1C9B8F] text-white">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Buy Stocks
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stocks.map((stock) => (
                  <Card
                    key={stock.symbol}
                    className="border-gray-200 hover:border-[#2EC4B6] hover:shadow-lg transition-all cursor-pointer"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{stock.logo}</div>
                          <div>
                            <div className="text-lg text-[#1C2541]">{stock.symbol}</div>
                            <div className="text-xs text-gray-500">{stock.name}</div>
                          </div>
                        </div>
                        {stock.change > 0 ? (
                          <TrendingUp className="w-5 h-5 text-[#2EC4B6]" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Price</span>
                          <span className="text-[#1C2541]">${stock.price}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Change</span>
                          <span
                            className={stock.change > 0 ? "text-[#2EC4B6]" : "text-red-400"}
                          >
                            {stock.change > 0 ? "+" : ""}${stock.change} ({stock.changePercent}%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                          <span className="text-sm text-gray-600">Your Value</span>
                          <span className="text-[#1C2541]">${stock.value.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Shares</span>
                          <span className="text-gray-500">{stock.shares}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="flex-1 bg-[#2EC4B6] hover:bg-[#1C9B8F] text-white">
                          Buy
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
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