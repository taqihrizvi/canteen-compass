import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Lightbulb, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Cloud, 
  Heart,
  Leaf,
  Users,
  ShoppingCart,
  Star,
  Flame,
  Plus,
  X
} from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface ComboDeals {
  id: number;
  name: string;
  description?: string;
  item_ids: number[];
  item_names?: string[];
  price: number;
  savings: number;
  is_active: boolean;
}

const Recommendations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<ComboDeals | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [comboDealsList, setComboDealsList] = useState<ComboDeals[]>([]);
  const [loadingCombos, setLoadingCombos] = useState(false);
  const [comboForm, setComboForm] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    setLoadingCombos(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3001/api/combos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setComboDealsList(data);
      }
    } catch (error) {
      console.error('Error fetching combos:', error);
    } finally {
      setLoadingCombos(false);
    }
  };

  const handleOpenModal = async (combo?: ComboDeals) => {
    if (combo) {
      setSelectedCombo(combo);
      setComboForm({
        name: combo.name,
        description: combo.description || ''
      });
    } else {
      setSelectedCombo(null);
      setComboForm({
        name: '',
        description: ''
      });
    }
    setSelectedItems([]);
    setIsComboModalOpen(true);
    
    // Fetch menu items
    await fetchMenuItems();
  };

  const fetchMenuItems = async () => {
    setLoadingMenu(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3001/api/menu/menu-items', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch menu items');
      
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive"
      });
    } finally {
      setLoadingMenu(false);
    }
  };

  const handleCloseModal = () => {
    setIsComboModalOpen(false);
    setSelectedCombo(null);
    setSelectedItems([]);
    setMenuItems([]);
  };

  const handleSelectItem = (item: MenuItem) => {
    if (!selectedItems.find(i => i.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setSelectedItems(selectedItems.filter(i => i.id !== itemId));
  };

  const calculateComboPrice = () => {
    const totalPrice = selectedItems.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
      return sum + price;
    }, 0);
    const discountedPrice = totalPrice * 0.9; // 10% discount
    const savings = totalPrice - discountedPrice;
    return { 
      totalPrice: Number(totalPrice), 
      discountedPrice: Number(discountedPrice), 
      savings: Number(savings) 
    };
  };

  const handleSaveCombo = async () => {
    if (!comboForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a combo name",
        variant: "destructive"
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one item",
        variant: "destructive"
      });
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const { discountedPrice, savings } = calculateComboPrice();
      
      const comboData = {
        name: comboForm.name,
        description: comboForm.description,
        item_ids: selectedItems.map(item => item.id),
        price: parseFloat(discountedPrice.toFixed(2)),
        savings: parseFloat(savings.toFixed(2))
      };

      const response = await fetch('http://localhost:3001/api/combos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(comboData)
      });

      if (!response.ok) {
        throw new Error('Failed to save combo');
      }
      
      toast({
        title: "Success",
        description: `Combo "${comboForm.name}" saved successfully`,
      });
      
      await fetchCombos();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving combo:', error);
      toast({
        title: "Error",
        description: "Failed to save combo",
        variant: "destructive"
      });
    }
  };

  // Personalized meal recommendations based on user profile
  const personalizedMeals = [
    {
      id: 1,
      name: "Grilled Chicken Salad",
      description: "Fresh greens with herb-marinated grilled chicken",
      price: 7.99,
      calories: 320,
      matchScore: 95,
      reasons: ["Matches your dietary preferences", "Popular at lunch time", "High protein"],
      tags: ["Healthy", "High Protein"],
      image: "🥗",
      discount: null
    },
    {
      id: 2,
      name: "Vegetarian Buddha Bowl",
      description: "Quinoa, roasted vegetables, and tahini dressing",
      price: 6.99,
      calories: 450,
      matchScore: 92,
      reasons: ["You ordered this last week", "Trending today", "Vegetarian option"],
      tags: ["Vegetarian", "Trending"],
      image: "🥙",
      discount: null
    },
    {
      id: 3,
      name: "Pasta Primavera",
      description: "Whole wheat pasta with seasonal vegetables",
      price: 5.99,
      calories: 520,
      matchScore: 88,
      reasons: ["Weather is cool today", "Popular in your loyalty tier", "Good value"],
      tags: ["Comfort Food", "Value"],
      image: "🍝",
      discount: 15
    }
  ];

  const comboDeals = [
    {
      id: 1,
      name: "Lunch Power Combo",
      items: ["Main dish", "Side salad", "Drink"],
      price: 9.99,
      savings: 2.50,
      matchScore: 90,
      image: "🍱"
    },
    {
      id: 2,
      name: "Healthy Start Bundle",
      items: ["Smoothie", "Fruit bowl", "Energy bar"],
      price: 7.99,
      savings: 1.80,
      matchScore: 87,
      image: "🥤"
    }
  ];

  const addOns = [
    { name: "Fresh Fruit Cup", price: 2.49, popular: true, image: "🍓" },
    { name: "Sparkling Water", price: 1.99, popular: false, image: "💧" },
    { name: "Greek Yogurt", price: 2.99, popular: true, image: "🥛" },
    { name: "Dark Chocolate", price: 1.49, popular: false, image: "🍫" }
  ];

  const trendingNow = [
    { name: "Spicy Chicken Wrap", orders: 45, trend: "+23%", image: "🌯" },
    { name: "Mediterranean Platter", orders: 38, trend: "+18%", image: "🥙" },
    { name: "Acai Bowl", orders: 32, trend: "+31%", image: "🥥" }
  ];
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Personalized Recommendations</h1>
            <p className="text-muted-foreground">
              AI-powered meal suggestions tailored for you, {user?.name}
            </p>
          </div>
          <Button onClick={() => handleOpenModal()} className="gap-2 bg-gradient-primary">
            <Plus className="w-4 h-4" />
            Create Combo
          </Button>
        </div>

        {/* Main Recommendations Tabs */}
        <Tabs defaultValue="combos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="combos">Create Combos</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="business">Business Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="for-you" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {personalizedMeals.map((meal) => (
                <Card key={meal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="text-4xl mb-2">{meal.image}</div>
                      <Badge variant="secondary" className="gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {meal.matchScore}% Match
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{meal.name}</CardTitle>
                    <CardDescription>{meal.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold">£{meal.price}</span>
                        {meal.discount && (
                          <Badge variant="destructive" className="ml-2">
                            {meal.discount}% OFF
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Flame className="h-4 w-4" />
                        {meal.calories} cal
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {meal.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      {meal.reasons.map((reason, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          {reason}
                        </div>
                      ))}
                    </div>

                    <Button className="w-full">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Order
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add-ons Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recommended Add-ons</CardTitle>
                <CardDescription>Complete your meal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {addOns.map((addon) => (
                    <div
                      key={addon.name}
                      className="flex flex-col items-center p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                    >
                      <div className="text-3xl mb-2">{addon.image}</div>
                      <div className="text-sm font-medium text-center mb-1">{addon.name}</div>
                      <div className="text-sm text-muted-foreground">£{addon.price}</div>
                      {addon.popular && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="combos" className="space-y-4">
            {loadingCombos ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading combo deals...</p>
              </div>
            ) : comboDealsList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No combo deals available. Create your first combo!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {comboDealsList.map((combo) => (
                  <Card key={combo.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="text-5xl mb-2">🍱</div>
                        <Badge variant="default" className="gap-1">
                          Active
                        </Badge>
                      </div>
                      <CardTitle>{combo.name}</CardTitle>
                      <CardDescription>
                        {combo.description || (combo.item_names && Array.isArray(combo.item_names) ? combo.item_names.join(" + ") : 'Combo deal')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold">£{typeof combo.price === 'number' ? combo.price.toFixed(2) : parseFloat(combo.price).toFixed(2)}</span>
                          <div className="text-sm text-green-600 font-medium">
                            Save £{typeof combo.savings === 'number' ? combo.savings.toFixed(2) : parseFloat(combo.savings).toFixed(2)}
                          </div>
                        </div>
                        <Button onClick={() => handleOpenModal(combo)}>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Edit Combo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Popular Right Now
                </CardTitle>
                <CardDescription>
                  What others are ordering in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendingNow.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{item.image}</div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {item.orders} orders today
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={item.trend.startsWith('+') ? 'default' : 'secondary'}>
                          {item.trend}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Order
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-4">
            {/* AI Insights Banner */}
            <Card className="shadow-medium bg-gradient-primary border-0">
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

            {/* Meal Recommendations for Business */}
            <Card className="shadow-soft">
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
          </TabsContent>
        </Tabs>

        {/* Combo Modal */}
        <Dialog open={isComboModalOpen} onOpenChange={setIsComboModalOpen}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedCombo ? 'Edit Combo' : 'Create New Combo'}</DialogTitle>
              <DialogDescription>
                Select menu items to create a combo deal. Price is automatically calculated with 10% discount.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="combo-name">Combo Name</Label>
                  <Input
                    id="combo-name"
                    placeholder="e.g., Lunch Power Combo"
                    value={comboForm.name}
                    onChange={(e) => setComboForm({ ...comboForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="combo-description">Description (optional)</Label>
                  <Input
                    id="combo-description"
                    placeholder="e.g., Perfect for busy afternoons"
                    value={comboForm.description}
                    onChange={(e) => setComboForm({ ...comboForm, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Available Items List */}
                <div className="space-y-2">
                  <Label>Available Menu Items</Label>
                  <div className="border rounded-lg p-4 h-[300px] overflow-y-auto bg-muted/30">
                    {loadingMenu ? (
                      <p className="text-sm text-muted-foreground text-center py-8">Loading menu items...</p>
                    ) : menuItems.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No menu items available</p>
                    ) : (
                      <div className="space-y-2">
                        {menuItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleSelectItem(item)}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedItems.find(i => i.id === item.id)
                                ? 'bg-muted border-muted cursor-not-allowed opacity-50'
                                : 'hover:bg-accent hover:border-primary bg-background'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.category}</p>
                              </div>
                              <p className="font-semibold text-sm">£{typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Items List */}
                <div className="space-y-2">
                  <Label>Selected Items ({selectedItems.length})</Label>
                  <div className="border rounded-lg p-4 h-[300px] overflow-y-auto bg-primary/5">
                    {selectedItems.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Click items from the left to add them to the combo
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-lg border bg-background flex justify-between items-start"
                          >
                            <div>
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.category}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm">£{typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}</p>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Calculation */}
              {selectedItems.length > 0 && (
                <div className="border rounded-lg p-4 bg-accent/50">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Price:</span>
                      <span className="font-medium">£{calculateComboPrice().totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount (10%):</span>
                      <span className="font-medium text-green-600">-£{calculateComboPrice().savings.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-semibold">Combo Price:</span>
                      <span className="font-bold text-lg text-primary">£{calculateComboPrice().discountedPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveCombo} 
                className="bg-gradient-primary"
                disabled={selectedItems.length < 2}
              >
                Save Combo Deal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Recommendations;
