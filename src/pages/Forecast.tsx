import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, Download } from "lucide-react";

const Forecast = () => {
  const forecastData = [
    { day: "Mon", predicted: 2850, actual: 2920 },
    { day: "Tue", predicted: 3100, actual: 2980 },
    { day: "Wed", predicted: 3250, actual: 3180 },
    { day: "Thu", predicted: 2900, actual: 2850 },
    { day: "Fri", predicted: 3400, actual: 3420 },
    { day: "Sat", predicted: 1800, actual: null },
    { day: "Sun", predicted: 1500, actual: null },
  ];

  const peakHours = [
    { time: "11:00 - 12:00", predicted: 120, staff: 4 },
    { time: "12:00 - 13:00", predicted: 280, staff: 7 },
    { time: "13:00 - 14:00", predicted: 190, staff: 5 },
    { time: "17:00 - 18:00", predicted: 95, staff: 3 },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Sales Forecast</h1>
          <p className="text-muted-foreground">AI-powered predictions and planning insights</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            This Week
          </Button>
          <Button className="gap-2 bg-gradient-primary">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Forecast Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Week Forecast</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">£18,800</p>
            <p className="text-sm text-success">+15.3% vs last week</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Expected Customers</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">1,847</p>
            <p className="text-sm text-muted-foreground">263 customers/day avg</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">Forecast Accuracy</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">94.2%</p>
            <p className="text-sm text-success">+2.1% improvement</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Forecast Chart */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Weekly Sales Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {forecastData.map((day) => (
                <div key={day.day} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{day.day}</span>
                    <div className="flex gap-4">
                      <span className="text-primary">Predicted: £{day.predicted}</span>
                      {day.actual && <span className="text-success">Actual: £{day.actual}</span>}
                    </div>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-primary rounded-full"
                      style={{ width: `${(day.predicted / 3500) * 100}%` }}
                    />
                    {day.actual && (
                      <div 
                        className="absolute left-0 top-0 h-full bg-success/30 rounded-full"
                        style={{ width: `${(day.actual / 3500) * 100}%` }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours & Staffing */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Peak Hours & Staffing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {peakHours.map((hour) => (
                <div key={hour.time} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{hour.time}</p>
                      <p className="text-sm text-muted-foreground">{hour.predicted} customers expected</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{hour.staff}</p>
                      <p className="text-xs text-muted-foreground">staff needed</p>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-primary rounded-full"
                      style={{ width: `${(hour.predicted / 280) * 100}%` }}
                    />
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

export default Forecast;
