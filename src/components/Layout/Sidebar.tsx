import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  TrendingUp,
  Lightbulb,
  Package,
  Users,
  Settings,
  ChefHat,
  LogOut,
  UserCog,
  Building2,
  BarChart3,
  UtensilsCrossed,
  ShoppingBag
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "User Management", href: "/users", icon: UserCog },
  { name: "Establishments", href: "/establishments", icon: Building2, hideForRoles: ["canteen_manager", "student"] },
  { name: "Menu Management", href: "/menu-management", icon: UtensilsCrossed },
  { name: "Orders", href: "/orders-management", icon: ShoppingBag },
  { name: "Sales Forecast", href: "/forecast", icon: TrendingUp, hideForRoles: ["admin"] },
  { name: "Forecast", href: "/admin-forecast", icon: BarChart3, hideForRoles: ["canteen_manager", "student"] },
  { name: "Recommendations", href: "/recommendations", icon: Lightbulb, hideForRoles: ["admin"] },
  { name: "Inventory", href: "/inventory", icon: Package, hideForRoles: ["admin"] },
  { name: "Customers", href: "/customers", icon: Users, hideForRoles: ["admin"] },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">CanteenAI</h1>
            <p className="text-xs text-muted-foreground">Smart Catering</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation
            .filter((item) => !item.hideForRoles?.includes(user?.role || ''))
            .map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">
                {user ? getInitials(user.name) : 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};
