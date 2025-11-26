import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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

interface Establishment {
  id: number;
  name: string;
  location: string;
  status: string;
  capacity: number;
  daily_orders: number;
  revenue: string;
  manager: string;
  rating: string;
  created_at: string;
  updated_at: string;
}

const AdminForecast = () => {
  const [selectedEstablishment, setSelectedEstablishment] = useState("all");
  const [establishments, setEstablishments] = useState<Array<{ id: string; name: string }>>([
    { id: "all", name: "All Establishments" },
  ]);
  const [loading, setLoading] = useState(true);
  const [currentData, setCurrentData] = useState<ForecastData | null>(null);
  const { toast } = useToast();

  // Map database establishment IDs to forecast data keys
  const getDataKeyForEstablishment = (establishmentId: string): string => {
    if (establishmentId === "all") return "all";

    // Map numeric IDs (from database) to existing forecast data
    // Cycle through the available forecast datasets
    const forecastKeys = ["main-campus", "science-building", "library", "sports-center"];
    const numericId = parseInt(establishmentId);
    if (!isNaN(numericId)) {
      return forecastKeys[(numericId - 1) % forecastKeys.length];
    }

    // If it's already a string key, use it
    return establishmentId;
  };

  useEffect(() => {
    // Update current data when selected establishment changes
    const dataKey = getDataKeyForEstablishment(selectedEstablishment);
    const newData = forecastDataByEstablishment[dataKey] || forecastDataByEstablishment["all"];
    setCurrentData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEstablishment]);

  useEffect(() => {
    const fetchEstablishments = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          console.warn('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:3001/api/establishments', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Establishments API error:', response.status, errorData);

          if (response.status === 403 || response.status === 401) {
            // Token is invalid or expired, user might need to re-login
            // But don't show error toast, just use default data
            console.warn('Authentication issue - using default establishments list');
          } else {
            throw new Error(`Failed to fetch establishments: ${response.status}`);
          }
          return;
        }

        const data: Establishment[] = await response.json();

        // Transform database establishments to match the format needed
        const transformedEstablishments = data.map(est => ({
          id: est.id.toString(),
          name: est.name,
        }));

        setEstablishments([
          { id: "all", name: "All Establishments" },
          ...transformedEstablishments,
        ]);
      } catch (error) {
        console.error('Error fetching establishments:', error);
        // Silently fail and keep default "All Establishments" option
      } finally {
        setLoading(false);
      }
    };

    fetchEstablishments();
  }, []);

  // Data by establishment
  interface ForecastData {
    weekForecast: string;
    weekGrowth: string;
    expectedCustomers: string;
    avgCustomers: string;
    confidence: string;
    accuracy: string;
    dailyForecast: Array<{ day: string; predicted: number; actual: number | null; confidence: number }>;
    hourlyForecast: Array<{ time: string; sales: number; customers: number; staff: number }>;
    categoryForecast: Array<{ category: string; predicted: number; trend: string; margin: string; color: string }>;
    topItems: Array<{ name: string; predicted: number; revenue: number; trend: string }>;
  }

  const forecastDataByEstablishment: Record<string, ForecastData> = {
    "all": {
      weekForecast: "£18,800",
      weekGrowth: "+15.3%",
      expectedCustomers: "1,847",
      avgCustomers: "263",
      confidence: "92%",
      accuracy: "94.2%",
      dailyForecast: [
        { day: "Mon", predicted: 2850, actual: 2920, confidence: 94 },
        { day: "Tue", predicted: 3100, actual: 2980, confidence: 92 },
        { day: "Wed", predicted: 3250, actual: 3180, confidence: 93 },
        { day: "Thu", predicted: 2900, actual: 2850, confidence: 91 },
        { day: "Fri", predicted: 3400, actual: 3420, confidence: 95 },
        { day: "Sat", predicted: 0, actual: null, confidence: 0 },
        { day: "Sun", predicted: 0, actual: null, confidence: 0 },
      ],
      hourlyForecast: [
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
      ],
      categoryForecast: [
        { category: "Hot Meals", predicted: 450, trend: "+12%", margin: "42%", color: "#f97316" },
        { category: "Sandwiches", predicted: 320, trend: "+8%", margin: "38%", color: "#eab308" },
        { category: "Salads", predicted: 280, trend: "+18%", margin: "45%", color: "#22c55e" },
        { category: "Beverages", predicted: 380, trend: "+5%", margin: "62%", color: "#3b82f6" },
        { category: "Snacks", predicted: 190, trend: "-3%", margin: "55%", color: "#a855f7" },
        { category: "Desserts", predicted: 150, trend: "+15%", margin: "48%", color: "#ec4899" },
      ],
      topItems: [
        { name: "Chicken Curry", predicted: 85, revenue: 468, trend: "+15%" },
        { name: "Caesar Salad", predicted: 72, revenue: 432, trend: "+22%" },
        { name: "Fish & Chips", predicted: 68, revenue: 374, trend: "+8%" },
        { name: "Veggie Wrap", predicted: 65, revenue: 325, trend: "+18%" },
        { name: "Pasta Bolognese", predicted: 58, revenue: 319, trend: "+12%" },
      ],
    },
    "main-campus": {
      weekForecast: "£8,500",
      weekGrowth: "+18.2%",
      expectedCustomers: "842",
      avgCustomers: "120",
      confidence: "94%",
      accuracy: "95.8%",
      dailyForecast: [
        { day: "Mon", predicted: 1350, actual: 1420, confidence: 95 },
        { day: "Tue", predicted: 1450, actual: 1380, confidence: 94 },
        { day: "Wed", predicted: 1520, actual: 1480, confidence: 96 },
        { day: "Thu", predicted: 1380, actual: 1350, confidence: 93 },
        { day: "Fri", predicted: 1600, actual: 1620, confidence: 97 },
        { day: "Sat", predicted: 0, actual: null, confidence: 0 },
        { day: "Sun", predicted: 0, actual: null, confidence: 0 },
      ],
      hourlyForecast: [
        { time: "08:00", sales: 25, customers: 7, staff: 1 },
        { time: "09:00", sales: 65, customers: 18, staff: 2 },
        { time: "10:00", sales: 95, customers: 26, staff: 2 },
        { time: "11:00", sales: 130, customers: 36, staff: 3 },
        { time: "12:00", sales: 220, customers: 62, staff: 4 },
        { time: "13:00", sales: 190, customers: 52, staff: 4 },
        { time: "14:00", sales: 105, customers: 29, staff: 2 },
        { time: "15:00", sales: 75, customers: 21, staff: 2 },
        { time: "16:00", sales: 60, customers: 17, staff: 1 },
        { time: "17:00", sales: 90, customers: 25, staff: 2 },
        { time: "18:00", sales: 45, customers: 13, staff: 1 },
      ],
      categoryForecast: [
        { category: "Hot Meals", predicted: 220, trend: "+15%", margin: "44%", color: "#f97316" },
        { category: "Sandwiches", predicted: 165, trend: "+10%", margin: "40%", color: "#eab308" },
        { category: "Salads", predicted: 140, trend: "+20%", margin: "47%", color: "#22c55e" },
        { category: "Beverages", predicted: 190, trend: "+6%", margin: "64%", color: "#3b82f6" },
        { category: "Snacks", predicted: 95, trend: "-2%", margin: "56%", color: "#a855f7" },
        { category: "Desserts", predicted: 75, trend: "+18%", margin: "50%", color: "#ec4899" },
      ],
      topItems: [
        { name: "Chicken Curry", predicted: 45, revenue: 248, trend: "+18%" },
        { name: "Caesar Salad", predicted: 38, revenue: 228, trend: "+25%" },
        { name: "Fish & Chips", predicted: 35, revenue: 193, trend: "+10%" },
        { name: "Veggie Wrap", predicted: 32, revenue: 160, trend: "+20%" },
        { name: "Pasta Bolognese", predicted: 30, revenue: 165, trend: "+15%" },
      ],
    },
    "science-building": {
      weekForecast: "£5,200",
      weekGrowth: "+12.5%",
      expectedCustomers: "487",
      avgCustomers: "70",
      confidence: "91%",
      accuracy: "93.5%",
      dailyForecast: [
        { day: "Mon", predicted: 820, actual: 850, confidence: 92 },
        { day: "Tue", predicted: 880, actual: 840, confidence: 91 },
        { day: "Wed", predicted: 920, actual: 900, confidence: 93 },
        { day: "Thu", predicted: 850, actual: 820, confidence: 90 },
        { day: "Fri", predicted: 950, actual: 970, confidence: 94 },
        { day: "Sat", predicted: 0, actual: null, confidence: 0 },
        { day: "Sun", predicted: 0, actual: null, confidence: 0 },
      ],
      hourlyForecast: [
        { time: "08:00", sales: 12, customers: 3, staff: 1 },
        { time: "09:00", sales: 35, customers: 10, staff: 1 },
        { time: "10:00", sales: 52, customers: 14, staff: 2 },
        { time: "11:00", sales: 75, customers: 20, staff: 2 },
        { time: "12:00", sales: 125, customers: 35, staff: 3 },
        { time: "13:00", sales: 110, customers: 30, staff: 3 },
        { time: "14:00", sales: 65, customers: 18, staff: 2 },
        { time: "15:00", sales: 42, customers: 12, staff: 1 },
        { time: "16:00", sales: 35, customers: 10, staff: 1 },
        { time: "17:00", sales: 52, customers: 15, staff: 2 },
        { time: "18:00", sales: 28, customers: 8, staff: 1 },
      ],
      categoryForecast: [
        { category: "Hot Meals", predicted: 135, trend: "+10%", margin: "41%", color: "#f97316" },
        { category: "Sandwiches", predicted: 98, trend: "+7%", margin: "37%", color: "#eab308" },
        { category: "Salads", predicted: 85, trend: "+16%", margin: "44%", color: "#22c55e" },
        { category: "Beverages", predicted: 115, trend: "+4%", margin: "61%", color: "#3b82f6" },
        { category: "Snacks", predicted: 58, trend: "-4%", margin: "54%", color: "#a855f7" },
        { category: "Desserts", predicted: 45, trend: "+12%", margin: "47%", color: "#ec4899" },
      ],
      topItems: [
        { name: "Sandwiches", predicted: 28, revenue: 154, trend: "+12%" },
        { name: "Coffee & Pastry", predicted: 25, revenue: 138, trend: "+20%" },
        { name: "Salad Bowl", predicted: 22, revenue: 121, trend: "+18%" },
        { name: "Soup & Bread", predicted: 20, revenue: 110, trend: "+15%" },
        { name: "Wraps", predicted: 18, revenue: 99, trend: "+10%" },
      ],
    },
    "library": {
      weekForecast: "£3,100",
      weekGrowth: "+14.8%",
      expectedCustomers: "356",
      avgCustomers: "51",
      confidence: "89%",
      accuracy: "92.1%",
      dailyForecast: [
        { day: "Mon", predicted: 480, actual: 510, confidence: 90 },
        { day: "Tue", predicted: 520, actual: 500, confidence: 89 },
        { day: "Wed", predicted: 550, actual: 540, confidence: 91 },
        { day: "Thu", predicted: 490, actual: 470, confidence: 88 },
        { day: "Fri", predicted: 580, actual: 600, confidence: 92 },
        { day: "Sat", predicted: 0, actual: null, confidence: 0 },
        { day: "Sun", predicted: 0, actual: null, confidence: 0 },
      ],
      hourlyForecast: [
        { time: "08:00", sales: 5, customers: 1, staff: 1 },
        { time: "09:00", sales: 15, customers: 4, staff: 1 },
        { time: "10:00", sales: 25, customers: 7, staff: 1 },
        { time: "11:00", sales: 35, customers: 10, staff: 1 },
        { time: "12:00", sales: 58, customers: 16, staff: 2 },
        { time: "13:00", sales: 52, customers: 14, staff: 2 },
        { time: "14:00", sales: 32, customers: 9, staff: 1 },
        { time: "15:00", sales: 22, customers: 6, staff: 1 },
        { time: "16:00", sales: 18, customers: 5, staff: 1 },
        { time: "17:00", sales: 28, customers: 8, staff: 1 },
        { time: "18:00", sales: 15, customers: 4, staff: 1 },
      ],
      categoryForecast: [
        { category: "Beverages", predicted: 98, trend: "+8%", margin: "68%", color: "#3b82f6" },
        { category: "Sandwiches", predicted: 72, trend: "+6%", margin: "36%", color: "#eab308" },
        { category: "Snacks", predicted: 65, trend: "+2%", margin: "58%", color: "#a855f7" },
        { category: "Salads", predicted: 48, trend: "+22%", margin: "46%", color: "#22c55e" },
        { category: "Hot Meals", predicted: 42, trend: "+5%", margin: "39%", color: "#f97316" },
        { category: "Desserts", predicted: 31, trend: "+16%", margin: "49%", color: "#ec4899" },
      ],
      topItems: [
        { name: "Coffee", predicted: 48, revenue: 144, trend: "+15%" },
        { name: "Muffins", predicted: 35, revenue: 105, trend: "+22%" },
        { name: "Sandwiches", predicted: 28, revenue: 140, trend: "+8%" },
        { name: "Tea", predicted: 22, revenue: 55, trend: "+12%" },
        { name: "Cookies", predicted: 20, revenue: 60, trend: "+18%" },
      ],
    },
    "sports-center": {
      weekForecast: "£2,000",
      weekGrowth: "+16.3%",
      expectedCustomers: "162",
      avgCustomers: "23",
      confidence: "88%",
      accuracy: "91.8%",
      dailyForecast: [
        { day: "Mon", predicted: 200, actual: 140, confidence: 89 },
        { day: "Tue", predicted: 250, actual: 260, confidence: 88 },
        { day: "Wed", predicted: 260, actual: 260, confidence: 90 },
        { day: "Thu", predicted: 180, actual: 210, confidence: 87 },
        { day: "Fri", predicted: 270, actual: 230, confidence: 91 },
        { day: "Sat", predicted: 0, actual: null, confidence: 0 },
        { day: "Sun", predicted: 0, actual: null, confidence: 0 },
      ],
      hourlyForecast: [
        { time: "08:00", sales: 3, customers: 1, staff: 1 },
        { time: "09:00", sales: 5, customers: 0, staff: 1 },
        { time: "10:00", sales: 8, customers: 1, staff: 1 },
        { time: "11:00", sales: 10, customers: 1, staff: 1 },
        { time: "12:00", sales: 17, customers: -1, staff: 1 },
        { time: "13:00", sales: 28, customers: -1, staff: 1 },
        { time: "14:00", sales: 8, customers: -2, staff: 1 },
        { time: "15:00", sales: 6, customers: -1, staff: 1 },
        { time: "16:00", sales: 7, customers: 0, staff: 1 },
        { time: "17:00", sales: 10, customers: 0, staff: 1 },
        { time: "18:00", sales: 7, customers: 0, staff: 1 },
      ],
      categoryForecast: [
        { category: "Beverages", predicted: 77, trend: "+12%", margin: "65%", color: "#3b82f6" },
        { category: "Snacks", predicted: 42, trend: "+8%", margin: "60%", color: "#a855f7" },
        { category: "Hot Meals", predicted: 53, trend: "+18%", margin: "40%", color: "#f97316" },
        { category: "Sandwiches", predicted: 35, trend: "+10%", margin: "38%", color: "#eab308" },
        { category: "Salads", predicted: 27, trend: "+14%", margin: "43%", color: "#22c55e" },
        { category: "Desserts", predicted: 19, trend: "+20%", margin: "52%", color: "#ec4899" },
      ],
      topItems: [
        { name: "Energy Drinks", predicted: 35, revenue: 105, trend: "+25%" },
        { name: "Protein Bars", predicted: 28, revenue: 112, trend: "+20%" },
        { name: "Fruit Smoothies", predicted: 22, revenue: 88, trend: "+18%" },
        { name: "Sports Drinks", predicted: 18, revenue: 54, trend: "+15%" },
        { name: "Wraps", predicted: 15, revenue: 75, trend: "+12%" },
      ],
    },
  };

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
      status: "School Holidays",
      impact: "Expected less traffic",
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

  // Extract current establishment data - add null checks
  const dailyForecast = currentData?.dailyForecast || [];
  const hourlyForecast = currentData?.hourlyForecast || [];
  const categoryForecast = currentData?.categoryForecast || [];
  const topItems = currentData?.topItems || [];

  const handleExportCSV = () => {
    if (!currentData) return;

    const selectedEstName = establishments.find(e => e.id === selectedEstablishment)?.name || "All Establishments";
    const timestamp = new Date().toISOString().split('T')[0];

    // Create CSV content
    let csvContent = `Forecast Report - ${selectedEstName}\nGenerated: ${timestamp}\n\n`;

    // Summary section
    csvContent += "Summary\n";
    csvContent += "Metric,Value\n";
    csvContent += `Week Forecast,${currentData.weekForecast}\n`;
    csvContent += `Week Growth,${currentData.weekGrowth}\n`;
    csvContent += `Expected Customers,${currentData.expectedCustomers}\n`;
    csvContent += `Avg Customers/Day,${currentData.avgCustomers}\n`;
    csvContent += `Confidence,${currentData.confidence}\n`;
    csvContent += `Accuracy,${currentData.accuracy}\n\n`;

    // Daily Forecast
    csvContent += "Daily Forecast\n";
    csvContent += "Day,Predicted (£),Actual (£),Confidence (%)\n";
    dailyForecast.forEach(day => {
      csvContent += `${day.day},${day.predicted},${day.actual || 'N/A'},${day.confidence}\n`;
    });
    csvContent += "\n";

    // Hourly Forecast
    csvContent += "Hourly Forecast\n";
    csvContent += "Time,Sales (£),Customers,Staff Needed\n";
    hourlyForecast.forEach(hour => {
      csvContent += `${hour.time},${hour.sales},${hour.customers},${hour.staff}\n`;
    });
    csvContent += "\n";

    // Category Forecast
    csvContent += "Category Forecast\n";
    csvContent += "Category,Predicted Sales,Trend,Margin\n";
    categoryForecast.forEach(cat => {
      csvContent += `${cat.category},${cat.predicted},${cat.trend},${cat.margin}\n`;
    });
    csvContent += "\n";

    // Top Items
    csvContent += "Top Performing Items\n";
    csvContent += "Item Name,Predicted Sales,Revenue (£),Trend\n";
    topItems.forEach(item => {
      csvContent += `${item.name},${item.predicted},${item.revenue},${item.trend}\n`;
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `forecast-report-${selectedEstName.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Forecast report has been downloaded.`,
    });
  };

  return (
    <DashboardLayout>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading forecast data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Sales Forecast</h1>
              <p className="text-muted-foreground">AI-powered predictions using Prophet algorithm and historical data</p>
            </div>
            <div className="flex gap-3">
              <Select value={selectedEstablishment} onValueChange={setSelectedEstablishment}>
                <SelectTrigger className="w-[280px] bg-white">
                  <SelectValue placeholder="Select establishment" />
                </SelectTrigger>
                <SelectContent>
                  {establishments.map((establishment) => (
                    <SelectItem key={establishment.id} value={establishment.id}>
                      {establishment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                This Week
              </Button>
              <Button className="gap-2" onClick={handleExportCSV}>
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
                <p className="text-3xl font-bold mb-1">{currentData?.weekForecast}</p>
                <p className="text-sm text-green-600 font-medium">{currentData?.weekGrowth} vs last week</p>
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
                <p className="text-3xl font-bold mb-1">{currentData?.expectedCustomers}</p>
                <p className="text-sm text-muted-foreground">{currentData?.avgCustomers} customers/day avg</p>
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
                <p className="text-3xl font-bold mb-1">{currentData?.accuracy}</p>
                <p className="text-sm text-green-600 font-medium">+2.1% improvement</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold">Confidence</h3>
                </div>
                <p className="text-3xl font-bold mb-1">{currentData?.confidence}</p>
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
                        {day.confidence === 0 ? (
                          <Badge className="bg-red-500 text-white">Closed</Badge>
                        ) : (
                          <Badge variant="secondary">{day.confidence}% confidence</Badge>
                        )}
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
      )}
    </DashboardLayout>
  );
};

export default AdminForecast;
