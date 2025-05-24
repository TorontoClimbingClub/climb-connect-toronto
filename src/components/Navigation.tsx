
import { Home, Calendar, User, Package, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Calendar, label: "Events", href: "/events" },
  { icon: Package, label: "Gear", href: "/gear" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: User, label: "Profile", href: "/profile" },
];

export const Navigation = () => {
  const currentPath = window.location.pathname;

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
        </div>
      </div>
    </nav>
  );
};
