import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, TrendingDown, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  id: number;
  item_name: string;
  current_stock: number;
  optimal_stock: number;
  unit: string;
  status: string;
  usage_rate: string;
  last_restocked: string;
  supplier: string;
  cost_per_unit: number;
}

interface ReorderSuggestion {
  id: number;
  item_name: string;
  quantity_needed: string;
  urgency: string;
  reason: string;
  estimated_cost: number;
  status: string;
}

interface Statistics {
  criticalItems: number;
  lowStockItems: number;
  totalInventoryValue: string;
}

const Inventory = () => {
  const [stockItems, setStockItems] = useState<InventoryItem[]>([]);
  const [reorderSuggestions, setReorderSuggestions] = useState<ReorderSuggestion[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({ criticalItems: 0, lowStockItems: 0, totalInventoryValue: '0' });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInventoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInventoryData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [itemsRes, suggestionsRes, statsRes] = await Promise.all([
        fetch('http://localhost:3001/api/inventory/items', { headers }),
        fetch('http://localhost:3001/api/inventory/reorder-suggestions', { headers }),
        fetch('http://localhost:3001/api/inventory/statistics', { headers }),
      ]);

      if (!itemsRes.ok || !suggestionsRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch inventory data');
      }

      const items = await itemsRes.json();
      const suggestions = await suggestionsRes.json();
      const stats = await statsRes.json();

      setStockItems(items);
      setReorderSuggestions(suggestions);
      setStatistics(stats);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading inventory data...</p>
        </div>
      </DashboardLayout>
    );
  }

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="font-semibold text-foreground">Critical Items</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{statistics.criticalItems}</p>
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
            <p className="text-3xl font-bold text-foreground mb-1">{statistics.lowStockItems}</p>
            <p className="text-sm text-muted-foreground">Below optimal levels</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Total Value</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">£{statistics.totalInventoryValue}</p>
            <p className="text-sm text-muted-foreground">Current inventory value</p>
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
            <p className="text-sm text-muted-foreground">vs last month</p>
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
                <div key={item.item_name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-foreground">{item.item_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.current_stock} / {item.optimal_stock} {item.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {item.usage_rate} Usage
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full ${item.status === "critical" ? "bg-destructive" :
                          item.status === "low" ? "bg-warning" :
                            item.status === "overstock" ? "bg-muted-foreground" :
                              "bg-success"
                        }`}
                      style={{ width: `${(item.current_stock / item.optimal_stock) * 100}%` }}
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
              {reorderSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-4 rounded-lg border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground">{suggestion.item_name}</h4>
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
                      <p className="text-sm font-medium text-foreground">{suggestion.quantity_needed}</p>
                      <p className="text-xs text-muted-foreground">Est. £{parseFloat(suggestion.estimated_cost.toString()).toFixed(2)}</p>
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
