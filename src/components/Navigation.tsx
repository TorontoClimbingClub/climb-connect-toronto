
import { Home, Calendar, User, Package, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const navigationItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Calendar, label: "Events", href: "/events" },
  { icon: Package, label: "Gear", href: "/gear", requiresAuth: true },
  { icon: Users, label: "Community", href: "/community" },
  { icon: User, label: "Profile", href: "/profile", requiresAuth: true },
];

export const Navigation = () => {
  const currentPath = window.location.pathname;
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .rpc('get_user_role', { _user_id: user.id });
        
        if (error) {
          console.error('Error fetching user role:', error);
          return;
        }
        
        setUserRole(data);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, [user]);

  const handleNavigation = (href: string, requiresAuth?: boolean) => {
    if (requiresAuth && !user) {
      window.location.href = '/auth';
    } else {
      window.location.href = href;
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const isActive = currentPath === item.href;
            const Icon = item.icon;
            
            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href, item.requiresAuth)}
                className={cn(
                  "flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors",
                  isActive 
                    ? "text-emerald-600 bg-emerald-50" 
                    : "text-stone-600 hover:text-emerald-600 hover:bg-stone-50"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
          
          {/* Admin button - only show for admin users */}
          {user && userRole === 'admin' && (
            <button
              onClick={() => handleNavigation('/admin')}
              className={cn(
                "flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors",
                currentPath === '/admin'
                  ? "text-emerald-600 bg-emerald-50" 
                  : "text-stone-600 hover:text-emerald-600 hover:bg-stone-50"
              )}
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs font-medium">Admin</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
