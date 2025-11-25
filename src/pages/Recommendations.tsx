import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, Sparkles } from "lucide-react";

const Recommendations = () => {
  const mealRecommendations = [
    {
      meal: "Chicken Caesar Salad",
      reason: "High margin item with low current stock usage",
      impact: "+£180 daily revenue",
      confidence: 92,
      tags: ["High Margin", "Trending"],
    },
    {
      meal: "Vegetable Wrap Combo",
      reason: "Weather: Warm day predicted, cold items perform 35% better",
      impact: "+45 sales predicted",
      confidence: 88,
      tags: ["Weather-Based", "Seasonal"],
    },
    {
      meal: "Hot Chocolate + Cookie",
      reason: "Bundle opportunity: 67% of cookie buyers also buy hot drinks",
      impact: "+£95 upsell revenue",
      confidence: 85,
      tags: ["Bundle", "Upsell"],
    },
    {
      meal: "Friday Special Pizza",
      reason: "Day of week: Pizza sales 40% higher on Fridays",
      impact: "+78 sales predicted",
      confidence: 94,
      tags: ["Day-Based", "Popular"],
    },
  ];

  const customerSegments = [
    {
      segment: "Regular Customers",
      count: 342,
      preference: "Hot meals, 12:00-12:30",
      suggestion: "Promote loyalty rewards for hot meal combos",
    },
    {
      segment: "Health-Conscious",
      count: 189,
      preference: "Salads, wraps, smoothies",
      suggestion: "Feature new protein salad bowl with seasonal vegetables",
    },
    {
      segment: "Quick Grab",
      count: 267,
      preference: "Sandwiches, snacks",
      suggestion: "Create express checkout queue for pre-packaged items",
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Recommendations</h1>
        <p className="text-muted-foreground">Personalized meal suggestions and optimization insights</p>
      </div>

      {/* AI Insights Banner */}
      <Card className="mb-8 shadow-medium bg-gradient-primary border-0">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Today's AI Insight</h3>
              <p className="text-white/90 mb-4">
                Based on weather forecast (18°C, partly cloudy) and historical data, cold drinks and light meals 
                are predicted to outperform by 28%. Consider promoting salads and cold beverages.
              </p>
              <Button variant="secondary" className="gap-2">
                <Lightbulb className="w-4 h-4" />
                Apply Recommendations
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Recommendations */}
      <Card className="mb-8 shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recommended Meals to Promote</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mealRecommendations.map((item, index) => (
              <div key={index} className="p-4 rounded-lg border border-border hover:border-primary transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-foreground">{item.meal}</h4>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {item.confidence}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{item.reason}</p>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-success">{item.impact}</span>
                </div>
                <div className="flex gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Segments */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Customer Segments & Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerSegments.map((segment, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{segment.segment}</h4>
                    <p className="text-sm text-muted-foreground">{segment.count} customers</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">Active</Badge>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Preference:</span> {segment.preference}
                  </p>
                </div>
                <div className="p-3 rounded bg-accent/50 border border-accent">
                  <p className="text-sm text-accent-foreground">
                    <Lightbulb className="w-4 h-4 inline mr-2" />
                    {segment.suggestion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Recommendations;
