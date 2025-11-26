import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Star, 
  Award, 
  TrendingUp, 
  Leaf,
  AlertCircle,
  Flame,
  Fish,
  Milk
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Allergen {
  id: number;
  name: string;
  description: string;
}

interface DietaryPreference {
  id: number;
  name: string;
  description: string;
  icon: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [dietaryPrefs, setDietaryPrefs] = useState<number[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);
  const [loadingAllergens, setLoadingAllergens] = useState(true);
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([]);
  const [loadingDietaryPrefs, setLoadingDietaryPrefs] = useState(true);

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'leaf': <Leaf className="h-4 w-4" />,
      'alert-circle': <AlertCircle className="h-4 w-4" />,
      'milk': <Milk className="h-4 w-4" />,
      'star': <Star className="h-4 w-4" />,
      'flame': <Flame className="h-4 w-4" />,
      'fish': <Fish className="h-4 w-4" />
    };
    return iconMap[iconName] || <Star className="h-4 w-4" />;
  };

  useEffect(() => {
    const fetchAllergens = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:3001/api/allergens', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setAllergens(data);
        }
      } catch (error) {
        console.error('Error fetching allergens:', error);
        toast({
          title: "Error",
          description: "Failed to load allergens",
          variant: "destructive"
        });
      } finally {
        setLoadingAllergens(false);
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
          setDietaryPreferences(data);
        }
      } catch (error) {
        console.error('Error fetching dietary preferences:', error);
        toast({
          title: "Error",
          description: "Failed to load dietary preferences",
          variant: "destructive"
        });
      } finally {
        setLoadingDietaryPrefs(false);
      }
    };

    const fetchUserPreferences = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:3001/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSelectedAllergens(data.allergen_ids || []);
          setDietaryPrefs(data.dietary_preference_ids || []);
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };

    fetchAllergens();
    fetchDietaryPreferences();
    fetchUserPreferences();
  }, [toast]);

  const handleDietaryChange = (optionId: number) => {
    setDietaryPrefs(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleAllergenChange = (allergenId: number) => {
    setSelectedAllergens(prev =>
      prev.includes(allergenId)
        ? prev.filter(id => id !== allergenId)
        : [...prev, allergenId]
    );
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3001/api/auth/preferences', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          allergenIds: selectedAllergens,
          dietaryPreferenceIds: dietaryPrefs
        })
      });

      if (response.ok) {
        toast({
          title: 'Profile updated!',
          description: 'Your preferences have been saved successfully.',
        });
      } else {
        throw new Error('Failed to update preferences');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save preferences. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const loyaltyTiers = {
    bronze: { color: 'bg-orange-500', points: '0-99', benefits: 'Basic discounts' },
    silver: { color: 'bg-gray-400', points: '100-499', benefits: '5% off, priority support' },
    gold: { color: 'bg-yellow-500', points: '500-999', benefits: '10% off, free delivery' },
    platinum: { color: 'bg-primary', points: '1000+', benefits: '15% off, exclusive menu' }
  };

  const currentTier = 'bronze';
  const tierInfo = loyaltyTiers[currentTier as keyof typeof loyaltyTiers];

  return (
    <div className="min-h-screen bg-[#EDF2F9]">
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
                      {getInitials(user?.name || 'U')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{user?.name}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Member Since</span>
                  <span className="text-sm">Nov 2025</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Total Orders</span>
                  <span className="text-sm font-bold">23</span>
                </div>
              </CardContent>
            </Card>

            {/* Loyalty Card */}
            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <CardTitle>Loyalty Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={`${tierInfo.color} text-white text-lg px-4 py-2`}>
                    {currentTier.toUpperCase()}
                  </Badge>
                  <div className="text-right">
                    <p className="text-2xl font-bold">245</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Gold</span>
                    <span className="font-medium">245/500</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all"
                      style={{ width: '49%' }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t space-y-2">
                  <p className="text-sm font-semibold">Your Benefits:</p>
                  <p className="text-sm text-muted-foreground">{tierInfo.benefits}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-500" />
                  Dietary Preferences
                </CardTitle>
                <CardDescription>
                  Help us personalize your menu recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingDietaryPrefs ? (
                  <p className="text-sm text-muted-foreground">Loading preferences...</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {dietaryPreferences.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                        onClick={() => handleDietaryChange(option.id)}
                      >
                        <Checkbox
                          id={`dietary-${option.id}`}
                          checked={dietaryPrefs.includes(option.id)}
                          onCheckedChange={() => handleDietaryChange(option.id)}
                        />
                        <label
                          htmlFor={`dietary-${option.id}`}
                          className="flex items-center gap-2 flex-1 cursor-pointer"
                        >
                          {getIconComponent(option.icon)}
                          <div>
                            <span className="text-sm font-medium block">{option.name}</span>
                            <span className="text-xs text-muted-foreground">{option.description}</span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                <Button onClick={handleSave} className="mt-4">
                  Update Preferences
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Allergen Information
                </CardTitle>
                <CardDescription>
                  Select any allergens you need to avoid for safer meal recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAllergens ? (
                  <p className="text-sm text-muted-foreground">Loading allergens...</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {allergens.map((allergen) => (
                      <div
                        key={allergen.id}
                        className="flex items-start space-x-3 p-3 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                        onClick={() => handleAllergenChange(allergen.id)}
                      >
                        <Checkbox
                          id={`allergen-${allergen.id}`}
                          checked={selectedAllergens.includes(allergen.id)}
                          onCheckedChange={() => handleAllergenChange(allergen.id)}
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`allergen-${allergen.id}`}
                            className="text-sm font-medium cursor-pointer block"
                          >
                            {allergen.name}
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            {allergen.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button onClick={handleSave} className="mt-4">
                  Save Allergen Preferences
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Your Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">23</p>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">£187</p>
                    <p className="text-xs text-muted-foreground">Spent</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">£23</p>
                    <p className="text-xs text-muted-foreground">Saved</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">4.8</p>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
