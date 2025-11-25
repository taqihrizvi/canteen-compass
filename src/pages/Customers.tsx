import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Award, Star } from "lucide-react";

const Customers = () => {
  const topCustomers = [
    { 
      name: "Sarah Johnson", 
      visits: 47, 
      spending: "£329.50", 
      favorite: "Chicken Caesar Salad",
      tier: "Gold",
      lastVisit: "Today"
    },
    { 
      name: "Michael Chen", 
      visits: 42, 
      spending: "£287.80", 
      favorite: "Margherita Pizza",
      tier: "Gold",
      lastVisit: "Yesterday"
    },
    { 
      name: "Emma Williams", 
      visits: 38, 
      spending: "£245.60", 
      favorite: "Vegetable Stir Fry",
      tier: "Silver",
      lastVisit: "2 days ago"
    },
    { 
      name: "James Brown", 
      visits: 35, 
      spending: "£231.20", 
      favorite: "Fish & Chips",
      tier: "Silver",
      lastVisit: "Today"
    },
  ];

  const segments = [
    {
      name: "High-Value Regulars",
      count: 87,
      avgSpending: "£6.80",
      frequency: "4.2x/week",
      growth: "+12%",
    },
    {
      name: "Health-Conscious",
      count: 134,
      avgSpending: "£5.20",
      frequency: "2.8x/week",
      growth: "+18%",
    },
    {
      name: "Budget Buyers",
      count: 203,
      avgSpending: "£3.90",
      frequency: "3.1x/week",
      growth: "+5%",
    },
  ];

  const insights = [
    "87% of Gold tier customers prefer hot meals during lunch hours",
    "Health-conscious segment shows 32% higher engagement with seasonal specials",
    "Weekend visitors spend 28% more on average than weekday customers",
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Customer Insights</h1>
        <p className="text-muted-foreground">Understand your customers and optimize engagement</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Users className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Total</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">1,234</p>
            <p className="text-sm text-success">+24 this week</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Award className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Gold Tier</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">87</p>
            <p className="text-sm text-muted-foreground">7% of base</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Avg. Spend</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">£5.40</p>
            <p className="text-sm text-success">+8.2% vs last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Star className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Satisfaction</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">4.6</p>
            <p className="text-sm text-muted-foreground">out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={customer.name} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.lastVisit}</p>
                      </div>
                    </div>
                    <Badge className={customer.tier === "Gold" ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground"}>
                      {customer.tier}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Visits</p>
                      <p className="font-semibold text-foreground">{customer.visits}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Spending</p>
                      <p className="font-semibold text-foreground">{customer.spending}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Favorite</p>
                      <p className="font-semibold text-foreground text-xs">{customer.favorite}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Customer Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              {segments.map((segment) => (
                <div key={segment.name} className="p-4 rounded-lg border border-border">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-foreground">{segment.name}</h4>
                    <Badge className="bg-success text-success-foreground">{segment.growth}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Count</p>
                      <p className="font-semibold text-foreground">{segment.count}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Spend</p>
                      <p className="font-semibold text-foreground">{segment.avgSpending}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Frequency</p>
                      <p className="font-semibold text-foreground">{segment.frequency}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Insights */}
            <div className="p-4 rounded-lg bg-accent/50 border border-accent">
              <h4 className="font-semibold text-accent-foreground mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Key Insights
              </h4>
              <ul className="space-y-2">
                {insights.map((insight, index) => (
                  <li key={index} className="text-sm text-accent-foreground flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
