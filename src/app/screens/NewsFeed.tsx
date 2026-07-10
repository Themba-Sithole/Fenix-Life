import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, Award, AlertCircle } from "lucide-react";

export default function NewsFeed() {
  const navigate = useNavigate();

  const news = [
    {
      headline: "TechVentures Inc. Wins Innovation Award",
      category: "Your Company",
      impact: "positive",
      emoji: "🏆",
      time: "2 hours ago",
      summary: "Your company has been recognized for outstanding innovation in the tech sector.",
    },
    {
      headline: "Tech Startup Raises $50 Million in Series B",
      category: "Industry",
      impact: "neutral",
      emoji: "💰",
      time: "5 hours ago",
      summary: "Competitor raises significant funding, expanding market presence.",
    },
    {
      headline: "Stock Market Falls 4% Amid Economic Concerns",
      category: "Economy",
      impact: "negative",
      emoji: "📉",
      time: "8 hours ago",
      summary: "Major indices drop as investors react to inflation data.",
    },
    {
      headline: "Government Increases Corporate Tax Rate",
      category: "Policy",
      impact: "negative",
      emoji: "🏛️",
      time: "1 day ago",
      summary: "New tax policy may impact business profitability across sectors.",
    },
    {
      headline: "Your Portfolio Up 3.2% This Week",
      category: "Personal Finance",
      impact: "positive",
      emoji: "📈",
      time: "1 day ago",
      summary: "Your investment strategy continues to show strong returns.",
    },
    {
      headline: "New AI Technology Disrupts Market",
      category: "Technology",
      impact: "neutral",
      emoji: "🤖",
      time: "2 days ago",
      summary: "Revolutionary AI platform launches, creating new opportunities.",
    },
    {
      headline: "Competitor Launches Competing Product",
      category: "Competition",
      impact: "warning",
      emoji: "⚡",
      time: "3 days ago",
      summary: "Major competitor enters your market segment with new offering.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl text-[#1C2541]">News Feed</h1>
            <p className="text-gray-600">Stay informed about your world</p>
          </div>
        </div>

        {/* News Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button size="sm" className="bg-[#2EC4B6] text-white">All News</Button>
          <Button size="sm" variant="outline">Your Company</Button>
          <Button size="sm" variant="outline">Economy</Button>
          <Button size="sm" variant="outline">Technology</Button>
          <Button size="sm" variant="outline">Personal</Button>
        </div>

        {/* News Items */}
        <div className="space-y-4">
          {news.map((item, index) => (
            <Card
              key={index}
              className={`border-[#2EC4B6]/20 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                item.impact === "positive"
                  ? "hover:border-[#2EC4B6]"
                  : item.impact === "negative"
                  ? "hover:border-red-400"
                  : "hover:border-[#F4B400]"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Emoji/Icon */}
                  <div className="text-5xl flex-shrink-0">{item.emoji}</div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-xl text-[#1C2541] mb-1">{item.headline}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant="outline"
                            className={
                              item.category === "Your Company"
                                ? "bg-[#2EC4B6]/10 text-[#2EC4B6] border-[#2EC4B6]/30"
                                : "text-gray-600"
                            }
                          >
                            {item.category}
                          </Badge>
                          <span className="text-sm text-gray-500">{item.time}</span>
                        </div>
                      </div>
                      
                      {/* Impact Indicator */}
                      {item.impact === "positive" && (
                        <TrendingUp className="w-6 h-6 text-[#2EC4B6] flex-shrink-0 ml-4" />
                      )}
                      {item.impact === "negative" && (
                        <TrendingDown className="w-6 h-6 text-red-400 flex-shrink-0 ml-4" />
                      )}
                      {item.impact === "warning" && (
                        <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 ml-4" />
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{item.summary}</p>
                    
                    {/* Market Impact */}
                    {item.impact !== "neutral" && (
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        item.impact === "positive"
                          ? "bg-[#2EC4B6]/10 text-[#2EC4B6]"
                          : item.impact === "negative"
                          ? "bg-red-50 text-red-600"
                          : "bg-orange-50 text-orange-600"
                      }`}>
                        {item.impact === "positive" && "Positive Impact"}
                        {item.impact === "negative" && "Negative Impact"}
                        {item.impact === "warning" && "Requires Attention"}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More News
          </Button>
        </div>
      </div>
    </div>
  );
}
