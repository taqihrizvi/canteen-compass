import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Search, 
  Star, 
  Flame, 
  Leaf, 
  Clock,
  Sparkles,
  Plus,
  Minus,
  X,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { showDemoNotifications } from '@/services/notificationService';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  calories: number;
  rating: number;
  isVegetarian?: boolean;
  isRecommended?: boolean;
  prepTime: string;
  tags: string[];
}

interface CartItem extends MenuItem {
  quantity: number;
}

const Menu = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Grilled Chicken Salad",
      description: "Fresh mixed greens with herb-marinated grilled chicken breast",
      price: 7.99,
      image: "🥗",
      category: "salads",
      calories: 320,
      rating: 4.8,
      isVegetarian: false,
      isRecommended: true,
      prepTime: "8 min",
      tags: ["High Protein", "Healthy"]
    },
    {
      id: 2,
      name: "Vegetarian Buddha Bowl",
      description: "Quinoa, roasted vegetables, chickpeas, and tahini dressing",
      price: 6.99,
      image: "🥙",
      category: "bowls",
      calories: 450,
      rating: 4.7,
      isVegetarian: true,
      isRecommended: true,
      prepTime: "10 min",
      tags: ["Vegetarian", "Trending"]
    },
    {
      id: 3,
      name: "Chicken Curry with Rice",
      description: "Tender chicken in aromatic curry sauce with basmati rice",
      price: 8.99,
      image: "🍛",
      category: "hot-meals",
      calories: 620,
      rating: 4.9,
      isVegetarian: false,
      prepTime: "12 min",
      tags: ["Popular", "Spicy"]
    },
    {
      id: 4,
      name: "Margherita Pizza Slice",
      description: "Classic tomato sauce, mozzarella, and fresh basil",
      price: 3.50,
      image: "🍕",
      category: "quick-bites",
      calories: 280,
      rating: 4.6,
      isVegetarian: true,
      prepTime: "5 min",
      tags: ["Quick", "Vegetarian"]
    },
    {
      id: 5,
      name: "Fish & Chips",
      description: "Beer-battered cod with hand-cut chips and tartar sauce",
      price: 9.99,
      image: "🐟",
      category: "hot-meals",
      calories: 750,
      rating: 4.7,
      isVegetarian: false,
      prepTime: "15 min",
      tags: ["Classic", "Popular"]
    },
    {
      id: 6,
      name: "Greek Yogurt Parfait",
      description: "Layered yogurt with granola, honey, and fresh berries",
      price: 4.99,
      image: "🥛",
      category: "healthy",
      calories: 320,
      rating: 4.8,
      isVegetarian: true,
      prepTime: "3 min",
      tags: ["Healthy", "Quick"]
    },
    {
      id: 7,
      name: "Spicy Chicken Wrap",
      description: "Grilled spicy chicken with lettuce, tomato, and chipotle mayo",
      price: 6.49,
      image: "🌯",
      category: "wraps",
      calories: 480,
      rating: 4.6,
      isVegetarian: false,
      isRecommended: false,
      prepTime: "7 min",
      tags: ["Spicy", "Trending"]
    },
    {
      id: 8,
      name: "Acai Bowl",
      description: "Acai berries, banana, granola, coconut flakes, and honey",
      price: 7.49,
      image: "🥥",
      category: "healthy",
      calories: 380,
      rating: 4.9,
      isVegetarian: true,
      isRecommended: true,
      prepTime: "5 min",
      tags: ["Healthy", "Superfood"]
    }
  ];

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    
    toast({
      title: "Added to cart!",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, change: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recommendedItems = menuItems.filter(item => item.isRecommended);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user?.name}! 👋</h1>
              <p className="text-sm text-muted-foreground">
                Role: <Badge variant="secondary">{user?.role}</Badge>
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => showDemoNotifications('customer')}
                className="gap-2"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Demo</span>
              </Button>
              <Button 
                className="relative gap-2" 
                onClick={() => setShowCart(!showCart)}
              >
                <ShoppingCart className="h-5 w-5" />
                Cart
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Personalized Recommendations */}
            {recommendedItems.length > 0 && !searchQuery && (
              <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Recommended Just For You
                  </CardTitle>
                  <CardDescription>
                    Based on your preferences and past orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 p-3 border rounded-lg hover:border-primary transition-colors bg-white"
                      >
                        <div className="text-4xl">{item.image}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{item.name}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {item.rating}
                          </p>
                          <p className="text-lg font-bold text-primary">£{item.price}</p>
                        </div>
                        <Button size="sm" onClick={() => addToCart(item)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Menu Categories */}
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="hot-meals">Hot Meals</TabsTrigger>
                <TabsTrigger value="salads">Salads</TabsTrigger>
                <TabsTrigger value="wraps">Wraps</TabsTrigger>
                <TabsTrigger value="healthy">Healthy</TabsTrigger>
                <TabsTrigger value="quick-bites">Quick</TabsTrigger>
              </TabsList>

              {['all', 'hot-meals', 'salads', 'wraps', 'healthy', 'quick-bites'].map((category) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredItems
                      .filter(item => category === 'all' || item.category === category)
                      .map((item) => (
                        <Card key={item.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="text-5xl mb-2">{item.image}</div>
                              <div className="flex flex-col gap-1">
                                {item.isVegetarian && (
                                  <Badge variant="outline" className="gap-1">
                                    <Leaf className="h-3 w-3" />
                                    Veg
                                  </Badge>
                                )}
                                <Badge variant="secondary" className="gap-1">
                                  <Star className="h-3 w-3 fill-current" />
                                  {item.rating}
                                </Badge>
                              </div>
                            </div>
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription>{item.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                  <Flame className="h-4 w-4 text-orange-500" />
                                  {item.calories} cal
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-blue-500" />
                                  {item.prepTime}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter className="flex items-center justify-between">
                            <span className="text-2xl font-bold">£{item.price}</span>
                            <Button onClick={() => addToCart(item)} className="gap-2">
                              <ShoppingCart className="h-4 w-4" />
                              Add to Cart
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Your Cart
                </CardTitle>
                <CardDescription>
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                          <div className="text-3xl">{item.image}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                            <p className="text-sm font-bold text-primary">£{item.price}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 ml-auto"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span className="font-semibold">£{cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Service Fee:</span>
                        <span className="font-semibold">£0.50</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total:</span>
                        <span>£{(cartTotal + 0.50).toFixed(2)}</span>
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
