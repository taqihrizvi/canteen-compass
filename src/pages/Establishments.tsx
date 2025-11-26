import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, Users, MapPin, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Establishment {
  id: number;
  name: string;
  location: string;
  status: string;
  capacity: number;
  daily_orders: number;
  revenue: string;
  manager: string;
  rating: number;
}

const Establishments = () => {
  const { toast } = useToast();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchEstablishments();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEstablishments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3001/api/establishments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch establishments');
      }

      const data = await response.json();
      setEstablishments(data);
    } catch (error) {
      console.error('Error fetching establishments:', error);
      toast({
        title: "Error",
        description: "Failed to load establishments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Establishments",
      value: "4",
      change: "+1 this quarter",
      icon: Building2,
      positive: true
    },
    {
      title: "Total Capacity",
      value: "510",
      change: "customers available",
      icon: Users,
      positive: true
    },
    {
      title: "Daily Orders",
      value: "783",
      change: "+12% vs yesterday",
      icon: TrendingUp,
      positive: true
    },
    {
      title: "Total Revenue",
      value: "£4,248",
      change: "+8.2% vs last week",
      icon: TrendingUp,
      positive: true
    },
  ];

  return (
    <DashboardLayout>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading establishments...</p>
        </div>
      ) : (
        <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Establishments</h1>
          <p className="text-muted-foreground">Manage all canteen locations and facilities</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Establishment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">{stat.title}</h3>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className={`text-sm ${stat.positive ? 'text-success' : 'text-muted-foreground'}`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Establishments List */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl font-bold">All Establishments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {establishments.map((establishment) => (
              <div key={establishment.name} className="p-4 rounded-lg border border-border hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-lg">{establishment.name}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {establishment.location}
                      </p>
                    </div>
                  </div>
                  <Badge className={establishment.status === "Active" ? "bg-success text-success-foreground" : "bg-red-500 text-white"}>
                    {establishment.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Capacity</p>
                    <p className="font-semibold text-foreground">{establishment.capacity} customers</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Daily Orders</p>
                    <p className="font-semibold text-foreground">{establishment.daily_orders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Revenue (Today)</p>
                    <p className="font-semibold text-foreground">£{Number(establishment.revenue).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Manager</p>
                    <p className="font-semibold text-foreground">{establishment.manager}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Rating</p>
                    <p className="font-semibold text-foreground">⭐ {establishment.rating}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Manage Staff
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
        </>
      )}
    </DashboardLayout>
  );
};

export default Establishments;
