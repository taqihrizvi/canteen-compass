import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  ChefHat, 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Brain, 
  Bell, 
  Calendar,
  Package,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Smart menu suggestions based on customer preferences, dietary restrictions, and purchase history.",
      color: "text-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Sales Forecasting",
      description: "Predict demand using weather data, historical trends, and special events to optimize inventory.",
      color: "text-blue-500"
    },
    {
      icon: Package,
      title: "Smart Inventory Management",
      description: "Real-time stock tracking with automatic low-stock alerts and intelligent reorder suggestions.",
      color: "text-orange-500"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Comprehensive dashboards showing sales metrics, top-performing items, and customer insights.",
      color: "text-green-500"
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      description: "Get alerts for low stock, forecast deviations, order updates, and promotional opportunities.",
      color: "text-red-500"
    },
    {
      icon: Users,
      title: "Customer Analytics",
      description: "Deep insights into customer behavior, purchase patterns, and engagement metrics.",
      color: "text-indigo-500"
    }
  ];

  const benefits = [
    "Reduce food waste by 30-40% with accurate demand forecasting",
    "Increase sales with personalized customer recommendations",
    "Save time with automated inventory management",
    "Improve customer satisfaction with smart menu optimization",
    "Make data-driven decisions with real-time analytics",
    "Boost operational efficiency across all departments"
  ];

  const roles = [
    {
      title: "For Administrators",
      description: "Complete control over operations with advanced analytics, forecasting, and inventory management.",
      features: ["Sales Dashboard", "Demand Forecasting", "Inventory Control", "Customer Analytics", "Menu Optimization"],
      icon: ChefHat,
      color: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
      title: "For Customers",
      description: "Seamless ordering experience with personalized recommendations and loyalty rewards.",
      features: ["Browse Menu", "Smart Recommendations", "Order History", "Loyalty Program", "Dietary Preferences"],
      icon: ShoppingCart,
      color: "bg-gradient-to-br from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Canteen Compass
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4" variant="secondary">
          <Sparkles className="h-3 w-3 mr-1" />
          AI-Powered Canteen Management
        </Badge>
        <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Transform Your Canteen
          <br />
          with Smart Technology
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Streamline operations, reduce waste, and delight customers with our AI-powered canteen management platform.
          Intelligent forecasting, personalized recommendations, and real-time analytics—all in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/register')} className="group">
            Start Free Trial
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
            View Demo
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Powerful Features</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to run a modern, efficient canteen operation
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className={`h-10 w-10 ${feature.color} mb-2`} />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white dark:bg-slate-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Choose Canteen Compass?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Proven results that transform your canteen operations
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Built for Everyone</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tailored experiences for administrators and customers
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {roles.map((role, index) => (
            <Card key={index} className="overflow-hidden">
              <div className={`h-32 ${role.color} flex items-center justify-center`}>
                <role.icon className="h-16 w-16 text-white" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{role.title}</CardTitle>
                <CardDescription className="text-base">{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="bg-slate-100 dark:bg-slate-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Built with Modern Technology</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powered by cutting-edge AI and cloud infrastructure
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { name: "React 18", description: "Fast UI" },
              { name: "TypeScript", description: "Type Safety" },
              { name: "OpenAI API", description: "AI Models" },
              { name: "Weather API", description: "Forecasting" },
              { name: "Recharts", description: "Analytics" },
              { name: "TailwindCSS", description: "Modern Design" },
              { name: "Shadcn/ui", description: "Components" },
              { name: "React Query", description: "Data Sync" }
            ].map((tech, index) => (
              <div key={index} className="text-center">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-2 shadow-sm">
                  <Calendar className="h-8 w-8 mx-auto text-primary" />
                </div>
                <h4 className="font-semibold">{tech.name}</h4>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-4xl mb-4">Ready to Get Started?</CardTitle>
            <CardDescription className="text-lg">
              Join hundreds of canteens already using Canteen Compass to optimize their operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/register')} className="group">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ChefHat className="h-6 w-6" />
            <span className="font-semibold text-foreground">Canteen Compass</span>
          </div>
          <p>© 2025 Canteen Compass. All rights reserved.</p>
          <p className="mt-2">AI-Powered Canteen Management Solution</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
