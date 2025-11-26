import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, ChefHat, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  status: string;
  stock: number;
  allergens: string[];
  calories?: number;
  tags?: string[];
}

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

const MenuManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    status: "Active",
    allergens: [] as string[],
    calories: "",
    tags: [] as string[],
  });
  const [allergenInput, setAllergenInput] = useState("");
  const { toast } = useToast();

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3001/api/menu/menu-items', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch menu items');

      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllergens = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3001/api/allergens', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch allergens');

      const data = await response.json();
      setAllergens(data);
    } catch (error) {
      console.error('Failed to load allergens:', error);
    }
  };

  const fetchDietaryPreferences = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3001/api/dietary-preferences', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch dietary preferences');

      const data = await response.json();
      setDietaryPreferences(data);
    } catch (error) {
      console.error('Failed to load dietary preferences:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
    fetchAllergens();
    fetchDietaryPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      stock: item.stock.toString(),
      status: item.status,
      allergens: item.allergens || [],
      calories: item.calories?.toString() || "",
      tags: item.tags || [],
    });
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      status: "Active",
      allergens: [],
      calories: "",
      tags: [],
    });
    setAddDialogOpen(true);
  };

  const handleDelete = (item: MenuItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:3001/api/menu/menu-items/${selectedItem.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete menu item');

      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });

      fetchMenuItems();
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        status: formData.status,
        allergens: formData.allergens,
        calories: formData.calories ? parseInt(formData.calories) : undefined,
        tags: formData.tags,
      };

      const url = selectedItem
        ? `http://localhost:3001/api/menu/menu-items/${selectedItem.id}`
        : 'http://localhost:3001/api/menu/menu-items';

      const response = await fetch(url, {
        method: selectedItem ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save menu item');

      toast({
        title: "Success",
        description: `Menu item ${selectedItem ? 'updated' : 'created'} successfully`,
      });

      fetchMenuItems();
      setEditDialogOpen(false);
      setAddDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${selectedItem ? 'update' : 'create'} menu item`,
        variant: "destructive",
      });
    }
  };

  const toggleAllergen = (allergenName: string) => {
    setFormData({
      ...formData,
      allergens: formData.allergens.includes(allergenName)
        ? formData.allergens.filter(a => a !== allergenName)
        : [...formData.allergens, allergenName],
    });
  };

  const toggleTag = (tagName: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.includes(tagName)
        ? formData.tags.filter(t => t !== tagName)
        : [...formData.tags, tagName],
    });
  };

  const categories = [
    { name: "Hot Meals", count: menuItems.filter(i => i.category === "Hot Meals").length, color: "bg-orange-500" },
    { name: "Salads", count: menuItems.filter(i => i.category === "Salads").length, color: "bg-green-500" },
    { name: "Sandwiches", count: menuItems.filter(i => i.category === "Sandwiches").length, color: "bg-yellow-500" },
    { name: "Beverages", count: menuItems.filter(i => i.category === "Beverages").length, color: "bg-blue-500" },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const FormDialog = ({ open, onOpenChange, title }: { open: boolean; onOpenChange: (open: boolean) => void; title: string }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Fill in the details below</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              className="bg-white"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="bg-white"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price (£)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                className="bg-white"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                className="bg-white"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hot Meals">Hot Meals</SelectItem>
                  <SelectItem value="Salads">Salads</SelectItem>
                  <SelectItem value="Sandwiches">Sandwiches</SelectItem>
                  <SelectItem value="Beverages">Beverages</SelectItem>
                  <SelectItem value="Snacks">Snacks</SelectItem>
                  <SelectItem value="Desserts">Desserts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                placeholder="e.g., 350"
                className="bg-white"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Dietary Requirements</Label>
            <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {dietaryPreferences.map((preference) => (
                  <div key={preference.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`tag-${preference.id}`}
                      checked={formData.tags.includes(preference.name)}
                      onCheckedChange={() => toggleTag(preference.name)}
                    />
                    <label
                      htmlFor={`tag-${preference.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {preference.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-sm text-muted-foreground">Selected:</span>
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Allergens</Label>
            <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {allergens.map((allergen) => (
                  <div key={allergen.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`allergen-${allergen.id}`}
                      checked={formData.allergens.includes(allergen.name)}
                      onCheckedChange={() => toggleAllergen(allergen.name)}
                    />
                    <label
                      htmlFor={`allergen-${allergen.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {allergen.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {formData.allergens.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-sm text-muted-foreground">Selected:</span>
                {formData.allergens.map((allergen) => (
                  <Badge key={allergen} variant="secondary">
                    {allergen}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading menu items...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Menu Management</h1>
          <p className="text-muted-foreground">Create and manage menu items across all establishments</p>
        </div>
        <Button className="gap-2" onClick={handleAdd}>
          <Plus className="w-4 h-4" />
          Add Menu Item
        </Button>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {categories.map((category) => (
          <Card key={category.name} className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">{category.name}</h3>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{category.count}</p>
              <p className="text-sm text-muted-foreground">items</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="shadow-soft mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="hot-meals">Hot Meals</SelectItem>
                <SelectItem value="salads">Salads</SelectItem>
                <SelectItem value="sandwiches">Sandwiches</SelectItem>
                <SelectItem value="beverages">Beverages</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items List */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Menu Items ({filteredItems.length})</CardTitle>
          <CardDescription>Manage all menu items and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-4 rounded-lg border border-border hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground text-lg">{item.name}</h4>
                      <Badge className="bg-success text-success-foreground">
                        {item.status}
                      </Badge>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-primary">£{typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Stock Available</p>
                    <p className="font-semibold text-foreground">{item.stock} items</p>
                  </div>
                  {item.calories && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Calories</p>
                      <p className="font-semibold text-foreground">{item.calories} cal</p>
                    </div>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Dietary Requirements</p>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(item)}>
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <FormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Menu Item"
      />

      {/* Add Dialog */}
      <FormDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        title="Add Menu Item"
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedItem?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default MenuManagement;
