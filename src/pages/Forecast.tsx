import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Calendar,
  Download,
  AlertTriangle,
  Users,
  Clock,
  Sun,
  Cloud,
  Snowflake,
  PartyPopper,
  BarChart3,
  LineChart
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Forecast = () => {
  const dailyForecast = [
    { day: "Mon", predicted: 2850, actual: 2920, confidence: 94 },
    { day: "Tue", predicted: 3100, actual: 2980, confidence: 92 },
    { day: "Wed", predicted: 3250, actual: 3180, confidence: 93 },
    { day: "Thu", predicted: 2900, actual: 2850, confidence: 91 },
    { day: "Fri", predicted: 3400, actual: 3420, confidence: 95 },
    { day: "Sat", predicted: 1800, actual: null, confidence: 88 },
    { day: "Sun", predicted: 1500, actual: null, confidence: 87 },
  ];

  const hourlyForecast = [
    { time: "08:00", sales: 45, customers: 12, staff: 2 },
    { time: "09:00", sales: 120, customers: 32, staff: 3 },
    { time: "10:00", sales: 180, customers: 48, staff: 4 },
    { time: "11:00", sales: 250, customers: 67, staff: 5 },
    { time: "12:00", sales: 420, customers: 112, staff: 8 },
    { time: "13:00", sales: 380, customers: 95, staff: 7 },
    { time: "14:00", sales: 210, customers: 54, staff: 4 },
    { time: "15:00", sales: 145, customers: 38, staff: 3 },
    { time: "16:00", sales: 120, customers: 32, staff: 2 },
    { time: "17:00", sales: 180, customers: 48, staff: 4 },
    { time: "18:00", sales: 95, customers: 25, staff: 2 },
  ];

  const categoryForecast = [
    { category: "Hot Meals", predicted: 450, trend: "+12%", margin: "42%", color: "#f97316" },
    { category: "Sandwiches", predicted: 320, trend: "+8%", margin: "38%", color: "#eab308" },
    { category: "Salads", predicted: 280, trend: "+18%", margin: "45%", color: "#22c55e" },
    { category: "Beverages", predicted: 380, trend: "+5%", margin: "62%", color: "#3b82f6" },
    { category: "Snacks", predicted: 190, trend: "-3%", margin: "55%", color: "#a855f7" },
    { category: "Desserts", predicted: 150, trend: "+15%", margin: "48%", color: "#ec4899" },
  ];

  const topItems = [
    { name: "Chicken Curry", predicted: 85, revenue: 468, trend: "+15%" },
    { name: "Caesar Salad", predicted: 72, revenue: 432, trend: "+22%" },
    { name: "Fish & Chips", predicted: 68, revenue: 374, trend: "+8%" },
    { name: "Veggie Wrap", predicted: 65, revenue: 325, trend: "+18%" },
    { name: "Pasta Bolognese", predicted: 58, revenue: 319, trend: "+12%" },
  ];

  const externalFactors = [
    {
      factor: "Weather",
      icon: <Cloud className="h-5 w-5" />,
      status: "Cloudy, 18°C",
      impact: "+8% cold items",
      color: "text-blue-500",
    },
    {
      factor: "Events",
      icon: <PartyPopper className="h-5 w-5" />,
      status: "Local festival",
      impact: "+35% traffic",
      color: "text-primary",
    },
    {
      factor: "Seasonality",
      icon: <Sun className="h-5 w-5" />,
      status: "Spring season",
      impact: "+12% salads",
      color: "text-orange-500",
    },
    {
      factor: "Day Type",
      icon: <Calendar className="h-5 w-5" />,
      status: "Friday (high)",
      impact: "+18% sales",
      color: "text-green-500",
    },
  ];

  const staffingRecommendation = [
    { shift: "Morning (8-12)", recommended: 5, current: 4, status: "Increase by 1" },
    { shift: "Lunch (12-15)", recommended: 8, current: 6, status: "Increase by 2" },
    { shift: "Afternoon (15-18)", recommended: 4, current: 4, status: "Optimal" },
    { shift: "Evening (18-20)", recommended: 2, current: 3, status: "Decrease by 1" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sales Forecast</h1>
            <p className="text-muted-foreground">AI-powered predictions using Prophet algorithm and historical data</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              This Week
            </Button>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold">Week Forecast</h3>
              </div>
              <p className="text-3xl font-bold mb-1">£18,800</p>
              <p className="text-sm text-green-600 font-medium">+15.3% vs last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold">Expected Customers</h3>
              </div>
              <p className="text-3xl font-bold mb-1">1,847</p>
              <p className="text-sm text-muted-foreground">263 customers/day avg</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold">Forecast Accuracy</h3>
              </div>
              <p className="text-3xl font-bold mb-1">94.2%</p>
              <p className="text-sm text-green-600 font-medium">+2.1% improvement</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold">Peak Hour</h3>
              </div>
              <p className="text-3xl font-bold mb-1">12:00 PM</p>
              <p className="text-sm text-muted-foreground">420 predicted sales</p>
            </CardContent>
          </Card>
        </div>

        {/* External Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              External Factors Affecting Forecast
            </CardTitle>
            <CardDescription>Real-time factors influencing sales predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {externalFactors.map((factor) => (
                <div key={factor.factor} className="p-4 border rounded-lg">
                  <div className={`flex items-center gap-2 mb-2 ${factor.color}`}>
                    {factor.icon}
                    <span className="font-semibold">{factor.factor}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{factor.status}</p>
                  <Badge variant="secondary" className="text-xs">
                    {factor.impact}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Forecast Tabs */}
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Daily Forecast</TabsTrigger>
            <TabsTrigger value="hourly">Hourly Breakdown</TabsTrigger>
            <TabsTrigger value="category">By Category</TabsTrigger>
            <TabsTrigger value="staffing">Staffing Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>7-Day Sales Forecast</CardTitle>
                <CardDescription>Predicted vs actual sales with confidence levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsLineChart data={dailyForecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#f97316"
                      strokeWidth={2}
                      name="Predicted Sales (£)"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#22c55e"
                      strokeWidth={2}
                      name="Actual Sales (£)"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>

                <div className="mt-6 space-y-3">
                  {dailyForecast.map((day) => (
                    <div key={day.day} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold w-12">{day.day}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm">Predicted: <span className="font-bold">£{day.predicted}</span></span>
                          {day.actual && (
                            <span className="text-sm">Actual: <span className="font-bold text-green-600">£{day.actual}</span></span>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary">{day.confidence}% confidence</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hourly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Sales & Customer Forecast</CardTitle>
                <CardDescription>Peak hours and recommended staffing levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={hourlyForecast}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorSales)"
                      name="Sales (£)"
                    />
                    <Area
                      type="monotone"
                      dataKey="customers"
                      stroke="#f97316"
                      fillOpacity={1}
                      fill="url(#colorCustomers)"
                      name="Customers"
                    />
                  </AreaChart>
                </ResponsiveContainer>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {hourlyForecast.filter(h => h.sales > 200).map((hour) => (
                    <div key={hour.time} className="p-4 border rounded-lg bg-orange-50/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="font-semibold">{hour.time}</span>
                        <Badge variant="destructive" className="ml-auto">Peak</Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p>Sales: <span className="font-bold">£{hour.sales}</span></p>
                        <p>Customers: <span className="font-bold">{hour.customers}</span></p>
                        <p>Staff needed: <span className="font-bold">{hour.staff}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="category" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Category Sales Forecast</CardTitle>
                  <CardDescription>Predicted sales by menu category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryForecast.map((cat) => (
                      <div key={cat.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{cat.category}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={cat.trend.startsWith('+') ? 'default' : 'secondary'}>
                              {cat.trend}
                            </Badge>
                            <span className="font-bold">{cat.predicted} sales</span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${(cat.predicted / 450) * 100}%`,
                              backgroundColor: cat.color
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Margin: {cat.margin}</span>
                          <span>Revenue: £{(cat.predicted * 5.5).toFixed(0)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Items</CardTitle>
                  <CardDescription>Highest predicted sales tomorrow</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topItems.map((item, idx) => (
                      <div key={item.name} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.predicted} sales · £{item.revenue} revenue
                          </p>
                        </div>
                        <Badge variant="secondary">{item.trend}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="staffing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Optimized Staffing Recommendations</CardTitle>
                <CardDescription>Based on predicted customer volume and peak hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffingRecommendation.map((shift) => (
                    <div
                      key={shift.shift}
                      className={`p-4 border rounded-lg ${shift.status.includes('Increase') ? 'bg-orange-50 border-orange-200' :
                          shift.status.includes('Decrease') ? 'bg-blue-50 border-blue-200' :
                            'bg-green-50 border-green-200'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          <span className="font-semibold">{shift.shift}</span>
                        </div>
                        <Badge
                          variant={
                            shift.status.includes('Increase') ? 'destructive' :
                              shift.status.includes('Optimal') ? 'default' :
                                'secondary'
                          }
                        >
                          {shift.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>Current: <span className="font-bold">{shift.current}</span></span>
                        <span>→</span>
                        <span>Recommended: <span className="font-bold">{shift.recommended}</span></span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Staffing Optimization Impact</h4>
                      <p className="text-sm text-blue-800">
                        Following these recommendations can reduce wait times by 18% during peak hours
                        and save approximately £145 in labor costs per week while maintaining service quality.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Forecast;
