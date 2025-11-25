import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, TrendingDown, Download } from "lucide-react";

const Inventory = () => {
  const stockItems = [
    { name: "Chicken Breast", current: 45, optimal: 120, unit: "kg", status: "critical", usage: "High" },
    { name: "Lettuce", current: 28, optimal: 50, unit: "heads", status: "low", usage: "Medium" },
    { name: "Pasta", current: 85, optimal: 100, unit: "kg", status: "good", usage: "High" },
    { name: "Tomato Sauce", current: 15, optimal: 30, unit: "L", status: "low", usage: "Medium" },
    { name: "Cheddar Cheese", current: 32, optimal: 40, unit: "kg", status: "good", usage: "High" },
    { name: "Rice", current: 95, optimal: 80, unit: "kg", status: "overstock", usage: "Medium" },
  ];

  const reorderSuggestions = [
    {
      item: "Chicken Breast",
      quantity: "75 kg",
      urgency: "Critical",
      reason: "Current stock covers only 1.5 days at current usage rate",
      cost: "£180",
    },
    {
      item: "Lettuce",
      quantity: "30 heads",
      urgency: "High",
      reason: "Forecast shows 35% increase in salad demand this week",
      cost: "£45",
    },
    {
      item: "Tomato Sauce",
      quantity: "20 L",
      urgency: "Medium",
      reason: "Stock running low, reorder to maintain buffer",
      cost: "£38",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "low":
        return "bg-warning text-warning-foreground";
      case "good":
        return "bg-success text-success-foreground";
      case "overstock":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Inventory Management</h1>
          <p className="text-muted-foreground">Real-time stock tracking and optimization</p>
        </div>
        <Button className="gap-2 bg-gradient-primary">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="font-semibold text-foreground">Critical Items</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">3</p>
            <p className="text-sm text-muted-foreground">Require immediate reorder</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-warning" />
              </div>
              <h3 className="font-semibold text-foreground">Low Stock</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">7</p>
            <p className="text-sm text-muted-foreground">Below optimal levels</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Waste Reduction</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">-18%</p>
            <p className="text-sm text-success">vs last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Levels */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Current Stock Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockItems.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.current} / {item.optimal} {item.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {item.usage} Usage
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`absolute left-0 top-0 h-full rounded-full ${
                        item.status === "critical" ? "bg-destructive" :
                        item.status === "low" ? "bg-warning" :
                        item.status === "overstock" ? "bg-muted-foreground" :
                        "bg-success"
                      }`}
                      style={{ width: `${(item.current / item.optimal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reorder Suggestions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Reorder Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reorderSuggestions.map((suggestion, index) => (
                <div key={index} className="p-4 rounded-lg border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground">{suggestion.item}</h4>
                    <Badge 
                      className={
                        suggestion.urgency === "Critical" ? getStatusColor("critical") :
                        suggestion.urgency === "High" ? getStatusColor("low") :
                        "bg-muted text-muted-foreground"
                      }
                    >
                      {suggestion.urgency}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{suggestion.reason}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-foreground">{suggestion.quantity}</p>
                      <p className="text-xs text-muted-foreground">Est. {suggestion.cost}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Order
                    </Button>
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

export default Inventory;
