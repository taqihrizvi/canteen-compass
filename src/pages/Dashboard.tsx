import { useEffect } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { MetricCard } from "@/components/Dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Package, Users, AlertTriangle, CheckCircle, Bell } from "lucide-react";
import { showDemoNotifications } from "@/services/notificationService";

const Dashboard = () => {
  const metrics = [
    {
      title: "Today's Revenue",
      value: "£2,847",
      change: "+12.5% from yesterday",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Items Sold",
      value: "342",
      change: "+8.2% from yesterday",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Low Stock Items",
      value: "7",
      change: "3 critical",
      changeType: "negative" as const,
      icon: Package,
    },
    {
      title: "Active Customers",
      value: "1,234",
      change: "+24 new today",
      changeType: "positive" as const,
      icon: Users,
    },
  ];

  const topItems = [
    { name: "Chicken Curry with Rice", sales: 45, revenue: "£247.50" },
    { name: "Margherita Pizza Slice", sales: 38, revenue: "£114.00" },
    { name: "Fish & Chips", sales: 32, revenue: "£176.00" },
    { name: "Vegetable Stir Fry", sales: 28, revenue: "£126.00" },
    { name: "Pasta Bolognese", sales: 25, revenue: "£137.50" },
  ];

  const alerts = [
    { type: "warning", message: "Chicken breast stock running low - reorder suggested", time: "2h ago" },
    { type: "success", message: "Peak lunch period: 94% of forecast achieved", time: "3h ago" },
    { type: "warning", message: "Vegetarian options selling faster than predicted", time: "4h ago" },
  ];

  return (
    <DashboardLayout>
      {/* Header with Demo Notifications Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => showDemoNotifications('admin')}
          className="gap-2"
        >
          <Bell className="h-4 w-4" />
          Test Notifications
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Top Selling Items Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topItems.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.sales} sold</p>
                    </div>
                  </div>
                  <p className="font-semibold text-foreground">{item.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Alerts & Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                  {alert.type === "warning" ? (
                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
