import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Bell,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { showDemoNotifications } from '@/services/notificationService';

interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  allergens?: string[];
  is_available: boolean;
  rating?: number;
  prepTime?: string;
  calories?: number;
  tags?: string[];
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface ComboDeal {
  id: number;
  name: string;
  description: string;
  price: number;
  savings: number;
  item_names: string[];
  is_active: boolean;
}

const Menu = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAllergenIds, setUserAllergenIds] = useState<number[]>([]);
  const [userDietaryPrefIds, setUserDietaryPrefIds] = useState<number[]>([]);
  const [allergenNames, setAllergenNames] = useState<Record<number, string>>({});
  const [dietaryPrefNames, setDietaryPrefNames] = useState<Record<number, string>>({});
  const [comboDeals, setComboDeals] = useState<ComboDeal[]>([]);
  const [loadingCombos, setLoadingCombos] = useState(true);

  const fetchMenuItems = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Fetching menu items with token:', token ? 'exists' : 'missing');

      const response = await fetch('http://localhost:3001/api/menu/menu-items', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched menu items:', data);
        // Transform database format to component format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedData = data.map((item: any) => ({
          id: item.id,
          title: item.name, // Backend returns 'name' (aliased from 'title')
          description: item.description || '',
          price: typeof item.price === 'number' ? item.price : parseFloat(item.price),
          image_url: item.image_url,
          category: item.category || 'other',
          allergens: item.allergens || [],
          is_available: item.status === 'Active', // Backend returns 'Active' or 'Inactive'
          rating: 4.5, // Default rating
          prepTime: '10 min', // Default prep time
          calories: item.calories || 400, // Use actual calories or default
          tags: item.tags || [] // Use actual tags from backend
        }));
        console.log('Transformed data:', transformedData);
        setMenuItems(transformedData);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch menu items:', response.status, errorText);
        toast({
          title: "Error",
          description: `Failed to load menu items: ${response.status}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:3001/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setUserAllergenIds(data.allergen_ids || []);
          setUserDietaryPrefIds(data.dietary_preference_ids || []);
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };

    const fetchAllergens = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:3001/api/allergens', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          const allergenMap: Record<number, string> = {};
          data.forEach((allergen: { id: number; name: string }) => {
            allergenMap[allergen.id] = allergen.name.toLowerCase();
          });
          setAllergenNames(allergenMap);
        }
      } catch (error) {
        console.error('Error fetching allergens:', error);
      }
    };

    const fetchDietaryPreferences = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:3001/api/dietary-preferences', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          const prefMap: Record<number, string> = {};
          data.forEach((pref: { id: number; name: string }) => {
            prefMap[pref.id] = pref.name.toLowerCase();
          });
          setDietaryPrefNames(prefMap);
        }
      } catch (error) {
        console.error('Error fetching dietary preferences:', error);
      }
    };

    fetchUserPreferences();
    fetchAllergens();
    fetchDietaryPreferences();
    fetchMenuItems();
    fetchComboDeals();
  }, [fetchMenuItems]);

  const fetchComboDeals = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Fetching combo deals...');
      const response = await fetch('http://localhost:3001/api/combos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('Combo deals response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched combo deals:', data);
        setComboDeals(data);
      } else {
        console.error('Failed to fetch combos:', response.status);
      }
    } catch (error) {
      console.error('Error fetching combo deals:', error);
    } finally {
      setLoadingCombos(false);
    }
  }; const addToCart = (item: MenuItem) => {
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
      description: `${item.title} has been added to your cart.`,
    });
  };

  const addComboToCart = (combo: ComboDeal) => {
    // Create a cart item from the combo deal
    const comboCartItem: CartItem = {
      id: combo.id + 10000, // Offset ID to avoid conflicts with menu items
      title: combo.name,
      description: `Combo Deal: ${combo.item_names.join(', ')}`,
      price: typeof combo.price === 'number' ? combo.price : parseFloat(combo.price || '0'),
      category: 'Combo',
      allergens: [],
      is_available: true,
      quantity: 1,
      rating: 5.0,
      prepTime: '15 min',
      calories: 0,
      tags: ['combo']
    };

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === comboCartItem.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === comboCartItem.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, comboCartItem];
    });

    toast({
      title: "Combo deal added!",
      description: `${combo.name} has been added to your cart.`,
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

  // Get relevant emoji based on menu item content
  const getMenuItemEmoji = (item: MenuItem): string => {
    const title = item.title.toLowerCase();
    const category = item.category.toLowerCase();
    const tags = item.tags?.map(t => t.toLowerCase()) || [];

    // Check title and tags for specific food items
    if (title.includes('burger') || title.includes('hamburger')) return '🍔';
    if (title.includes('pizza')) return '🍕';
    if (title.includes('pasta') || title.includes('spaghetti') || title.includes('lasagna')) return '🍝';
    if (title.includes('taco') || title.includes('burrito')) return '🌮';
    if (title.includes('sushi') || title.includes('sashimi')) return '🍣';
    if (title.includes('curry')) return '🍛';
    if (title.includes('rice') && title.includes('fried')) return '🍛';
    if (title.includes('rice')) return '🍚';
    if (title.includes('noodle') || title.includes('ramen')) return '🍜';
    if (title.includes('soup')) return '🍲';
    if (title.includes('steak') || title.includes('beef')) return '🥩';
    if (title.includes('chicken') && (title.includes('fried') || title.includes('nugget'))) return '🍗';
    if (title.includes('chicken')) return '🍗';
    if (title.includes('fish') && title.includes('chip')) return '🐟';
    if (title.includes('fish')) return '🐟';
    if (title.includes('egg') || title.includes('omelette')) return '🍳';
    if (title.includes('bacon')) return '🥓';
    if (title.includes('hotdog') || title.includes('hot dog')) return '🌭';
    if (title.includes('sandwich') || title.includes('sub')) return '🥪';
    if (title.includes('wrap')) return '🌯';
    if (title.includes('fries') || title.includes('chips')) return '🍟';
    if (title.includes('potato')) return '🥔';

    // Salads
    if (title.includes('salad')) return '🥗';

    // Desserts
    if (title.includes('cake')) return '🍰';
    if (title.includes('cupcake')) return '🧁';
    if (title.includes('cookie') || title.includes('biscuit')) return '🍪';
    if (title.includes('donut') || title.includes('doughnut')) return '🍩';
    if (title.includes('ice cream') || title.includes('icecream')) return '🍦';
    if (title.includes('pie')) return '🥧';
    if (title.includes('pudding')) return '🍮';
    if (title.includes('chocolate')) return '🍫';

    // Beverages
    if (title.includes('coffee') || title.includes('espresso') || title.includes('latte') || title.includes('cappuccino')) return '☕';
    if (title.includes('tea')) return '🍵';
    if (title.includes('juice')) return '🧃';
    if (title.includes('smoothie')) return '🥤';
    if (title.includes('soda') || title.includes('cola') || title.includes('fizzy')) return '🥤';
    if (title.includes('water')) return '💧';
    if (title.includes('milk') || title.includes('milkshake')) return '🥛';
    if (title.includes('beer')) return '🍺';
    if (title.includes('wine')) return '🍷';

    // Fruits
    if (title.includes('apple')) return '🍎';
    if (title.includes('banana')) return '🍌';
    if (title.includes('orange')) return '🍊';
    if (title.includes('strawberry')) return '🍓';
    if (title.includes('grape')) return '🍇';
    if (title.includes('watermelon')) return '🍉';

    // Bread items
    if (title.includes('bread') || title.includes('toast')) return '🍞';
    if (title.includes('croissant')) return '🥐';
    if (title.includes('bagel')) return '🥯';
    if (title.includes('pretzel')) return '🥨';

    // Category-based fallbacks
    if (category === 'salad') return '🥗';
    if (category === 'dessert') return '🍰';
    if (category === 'beverages') return '🥤';
    if (category === 'sandwiches') return '🥪';
    if (category === 'main course') return '🍽️';

    // Check tags for dietary preferences
    if (tags.includes('vegan')) return '🥬';
    if (tags.includes('vegetarian')) return '🥗';

    // Default
    return '🍽️';
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredItems = menuItems.filter(item =>
    item.is_available && (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Filter items based on user preferences
  const getRecommendedItems = () => {
    // First, exclude items with allergens the user needs to avoid
    const safeItems = filteredItems.filter(item => {
      if (!item.allergens || item.allergens.length === 0) return true;

      // Check if any of the item's allergens match user's allergen IDs
      const itemAllergenNames = item.allergens.map(a => a.toLowerCase());
      const userAllergenNamesList = userAllergenIds.map(id => allergenNames[id]).filter(Boolean);

      // Return false if any user allergen is in the item
      return !itemAllergenNames.some(allergen =>
        userAllergenNamesList.some(userAllergen =>
          allergen.includes(userAllergen) || userAllergen.includes(allergen)
        )
      );
    });

    // If user has dietary preferences, try to match them
    if (userDietaryPrefIds.length > 0) {
      const matchingItems = safeItems.filter(item => {
        const itemTitle = item.title.toLowerCase();
        const itemDesc = item.description.toLowerCase();
        const itemCategory = item.category.toLowerCase();
        const itemText = `${itemTitle} ${itemDesc} ${itemCategory}`;

        // Check if item matches any dietary preference
        return userDietaryPrefIds.some(id => {
          const prefName = dietaryPrefNames[id];
          if (!prefName) return false;

          // Check for keyword matches
          if (prefName.includes('vegetarian') && itemText.includes('vegetarian')) return true;
          if (prefName.includes('vegan') && itemText.includes('vegan')) return true;
          if (prefName.includes('gluten') && itemText.includes('gluten-free')) return true;
          if (prefName.includes('halal') && itemText.includes('halal')) return true;
          if (prefName.includes('pescatarian') && (itemText.includes('fish') || itemText.includes('seafood'))) return true;

          return false;
        });
      });

      // If we found matching items, use them; otherwise fall back to safe items
      if (matchingItems.length > 0) {
        return matchingItems.slice(0, 4);
      }
    }

    // Return any 4 safe items
    return safeItems.slice(0, 4);
  };

  const recommendedItems = getRecommendedItems();

  return (
    <div className="min-h-screen bg-[#EDF2F9]">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
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
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading menu items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Combo Deals and Recommendations Tabs */}
              {(comboDeals.length > 0 || recommendedItems.length > 0) && (
                <Tabs defaultValue="combos" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2 bg-muted">
                    <TabsTrigger value="combos" className="data-[state=active]:bg-white">Combo Deals</TabsTrigger>
                    <TabsTrigger value="recommendations" className="data-[state=active]:bg-white">Recommended For You</TabsTrigger>
                  </TabsList>

                  {/* Combo Deals Tab */}
                  <TabsContent value="combos" className="space-y-4">
                    {loadingCombos ? (
                      <Card>
                        <CardContent className="py-8">
                          <p className="text-sm text-muted-foreground text-center">Loading combo deals...</p>
                        </CardContent>
                      </Card>
                    ) : comboDeals.length > 0 ? (
                      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-transparent">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Badge className="bg-orange-500 text-white">COMBO DEALS</Badge>
                            <span>Save More with Our Special Combos</span>
                          </CardTitle>
                          <CardDescription>Pre-selected meal combinations at discounted prices</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 gap-4">
                            {comboDeals.map((combo) => (
                              <div
                                key={combo.id}
                                className="p-4 border-2 border-orange-200 rounded-lg bg-white hover:border-orange-400 transition-colors"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h3 className="text-lg font-bold">{combo.name}</h3>
                                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                                        Save £{typeof combo.savings === 'number' ? combo.savings.toFixed(2) : parseFloat(combo.savings || '0').toFixed(2)}
                                      </Badge>
                                    </div>
                                    {combo.description && (
                                      <p className="text-sm text-muted-foreground mb-3">{combo.description}</p>
                                    )}
                                    <div className="space-y-1">
                                      <p className="text-xs font-semibold text-muted-foreground uppercase">Includes:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {combo.item_names.map((itemName, idx) => (
                                          <Badge key={idx} variant="outline" className="text-xs">
                                            {itemName}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2 ml-4">
                                    <div className="text-right">
                                      <p className="text-2xl font-bold text-orange-600">£{typeof combo.price === 'number' ? combo.price.toFixed(2) : parseFloat(combo.price || '0').toFixed(2)}</p>
                                    </div>
                                    <Button
                                      size="sm"
                                      className="bg-orange-500 hover:bg-orange-600"
                                      onClick={() => addComboToCart(combo)}
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      Add Deal
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="py-8">
                          <p className="text-sm text-muted-foreground text-center">No combo deals available at the moment</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  {/* Recommendations Tab */}
                  <TabsContent value="recommendations" className="space-y-4">
                    {recommendedItems.length > 0 ? (
                      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Recommended Just For You
                          </CardTitle>
                          <CardDescription>Based on your preferences and past orders</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {recommendedItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex gap-3 p-3 border rounded-lg hover:border-primary transition-colors bg-white"
                              >
                                <div className="text-4xl">{item.image_url || getMenuItemEmoji(item)}</div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold truncate">{item.title}</h4>
                                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    {item.rating || 4.5}
                                  </div>
                                  <div className="text-lg font-bold text-primary">£{item.price.toFixed(2)}</div>
                                </div>
                                <Button size="sm" onClick={() => addToCart(item)}>
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="py-8">
                          <p className="text-sm text-muted-foreground text-center">No recommendations available</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              )}

              {/* Menu Categories */}
              <Tabs defaultValue="all" className="space-y-4">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white"
                  />
                </div>

                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 bg-muted">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white">All</TabsTrigger>
                  <TabsTrigger value="main course" className="data-[state=active]:bg-white">Hot Meals</TabsTrigger>
                  <TabsTrigger value="salad" className="data-[state=active]:bg-white">Salads</TabsTrigger>
                  <TabsTrigger value="sandwiches" className="data-[state=active]:bg-white">Sandwiches</TabsTrigger>
                  <TabsTrigger value="dessert" className="data-[state=active]:bg-white">Desserts</TabsTrigger>
                  <TabsTrigger value="beverages" className="data-[state=active]:bg-white">Drinks</TabsTrigger>
                </TabsList>

                {['all', 'main course', 'salad', 'sandwiches', 'dessert', 'beverages'].map((category) => (
                  <TabsContent key={category} value={category} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredItems
                        .filter(item => category === 'all' || item.category.toLowerCase() === category.toLowerCase())
                        .map((item) => (
                          <Card key={item.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="text-5xl mb-2">{item.image_url || getMenuItemEmoji(item)}</div>
                                <div className="flex flex-col gap-1">
                                  <Badge variant="secondary" className="gap-1">
                                    <Star className="h-3 w-3 fill-current" />
                                    {item.rating || 4.5}
                                  </Badge>
                                </div>
                              </div>
                              <CardTitle className="text-lg">{item.title}</CardTitle>
                              <CardDescription>{item.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1">
                                  <Flame className="h-4 w-4 text-orange-500" />
                                  {item.calories || 400} cal
                                </span>
                                {item.tags && item.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {item.tags.map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {item.allergens && item.allergens.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground mb-1">Contains:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {item.allergens.map((allergen) => (
                                      <Badge key={allergen} variant="destructive" className="text-xs">
                                        {allergen}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                            <CardFooter className="flex items-center justify-between">
                              <span className="text-2xl font-bold">£{item.price.toFixed(2)}</span>
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
                            <div className="text-3xl">
                              {item.category === 'Combo' ? (
                                <div className="bg-orange-100 rounded-lg p-2 flex items-center justify-center">
                                  <Package className="h-6 w-6 text-orange-600" />
                                </div>
                              ) : (
                                item.image_url || getMenuItemEmoji(item)
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                              <div className="text-sm font-bold text-primary">£{item.price.toFixed(2)}</div>
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

                      <Button className="w-full" size="lg" onClick={() => navigate('/checkout', { state: { cart } })}>
                        Proceed to Checkout
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
