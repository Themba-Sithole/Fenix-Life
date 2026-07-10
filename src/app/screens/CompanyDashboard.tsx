import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, Users, DollarSign, Package, BarChart3, Target } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function CompanyDashboard() {
  const navigate = useNavigate();

  const revenueData = [
    { month: "Jan", revenue: 95000, profit: 28500 },
    { month: "Feb", revenue: 108000, profit: 32400 },
    { month: "Mar", revenue: 122000, profit: 36600 },
    { month: "Apr", revenue: 135000, profit: 40500 },
    { month: "May", revenue: 142000, profit: 42600 },
    { month: "Jun", revenue: 145000, profit: 43500 },
  ];

  const departmentData = [
    { name: "Engineering", value: 18, color: "#2EC4B6" },
    { name: "Sales", value: 12, color: "#F4B400" },
    { name: "Marketing", value: 8, color: "#1C2541" },
    { name: "Operations", value: 4, color: "#0B132B" },
  ];

  const metrics = [
    { label: "Revenue", value: "$145K", change: "+12.5%", trend: "up", icon: DollarSign },
    { label: "Profit", value: "$43.5K", change: "+8.3%", trend: "up", icon: TrendingUp },
    { label: "Employees", value: "42", change: "+5", trend: "up", icon: Users },
    { label: "Products", value: "8", change: "+2", trend: "up", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA]">
      {/* Hero Header with Image */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1707077865701-2854996afc4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZyUyMGNpdHlzY2FwZXxlbnwxfHx8fDE3ODM3MDY3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Modern office building"
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
                <h1 className="text-4xl text-white mb-2">TechVentures Inc.</h1>
                <p className="text-gray-300">Company Dashboard</p>
              </div>
              <Badge className="bg-[#2EC4B6] text-white px-4 py-2 text-sm">
                Growing • Series A
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          {metrics.map((metric) => (
            <Card key={metric.label} className="border-[#2EC4B6]/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="w-5 h-5 text-[#2EC4B6]" />
                  <Badge
                    variant="outline"
                    className={`${
                      metric.trend === "up"
                        ? "bg-[#2EC4B6]/10 text-[#2EC4B6] border-[#2EC4B6]/30"
                        : "bg-red-50 text-red-600 border-red-200"
                    }`}
                  >
                    {metric.change}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                <div className="text-3xl text-[#1C2541]">{metric.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue & Profit Chart */}
          <Card className="lg:col-span-2 border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Revenue & Profit Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#2EC4B6" strokeWidth={3} />
                  <Line type="monotone" dataKey="profit" stroke="#F4B400" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#2EC4B6] rounded"></div>
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#F4B400] rounded"></div>
                  <span className="text-sm text-gray-600">Profit</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card className="border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Team Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {departmentData.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{dept.name}</span>
                    </div>
                    <span className="text-sm text-[#1C2541]">{dept.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Company Overview */}
          <Card className="border-[#F4B400]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Company Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Company Value</span>
                <span className="text-[#2EC4B6]">$5,200,000</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Market Share</span>
                <span className="text-[#1C2541]">8.3%</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Growth Rate</span>
                <span className="text-[#2EC4B6]">+32% YoY</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Reputation</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < 4 ? "bg-[#F4B400]" : "bg-gray-300"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.2/5</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customers</span>
                <span className="text-[#1C2541]">1,248</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-2 border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541]">Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  onClick={() => navigate("/employees")}
                  className="h-24 bg-gradient-to-br from-[#2EC4B6] to-[#1C9B8F] text-white hover:opacity-90 flex flex-col items-center justify-center gap-2"
                >
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Employees</span>
                </Button>
                <Button
                  className="h-24 bg-gradient-to-br from-[#F4B400] to-[#d69f00] text-white hover:opacity-90 flex flex-col items-center justify-center gap-2"
                >
                  <Package className="w-6 h-6" />
                  <span className="text-sm">Products</span>
                </Button>
                <Button
                  className="h-24 bg-gradient-to-br from-[#1C2541] to-[#0B132B] text-white hover:opacity-90 flex flex-col items-center justify-center gap-2"
                >
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-sm">Marketing</span>
                </Button>
                <Button
                  className="h-24 bg-gradient-to-br from-[#2EC4B6] to-[#1C9B8F] text-white hover:opacity-90 flex flex-col items-center justify-center gap-2"
                >
                  <Target className="w-6 h-6" />
                  <span className="text-sm">Sales</span>
                </Button>
                <Button
                  className="h-24 bg-gradient-to-br from-[#F4B400] to-[#d69f00] text-white hover:opacity-90 flex flex-col items-center justify-center gap-2"
                >
                  <DollarSign className="w-6 h-6" />
                  <span className="text-sm">Finance</span>
                </Button>
                <Button
                  className="h-24 bg-gradient-to-br from-[#1C2541] to-[#0B132B] text-white hover:opacity-90 flex flex-col items-center justify-center gap-2"
                >
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Board</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}