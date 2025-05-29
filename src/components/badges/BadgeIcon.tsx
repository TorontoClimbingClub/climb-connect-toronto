
import { memo } from "react";
import { Badge as BadgeType } from "@/types/badges";
import { Badge } from "@/components/ui/badge";
import { Award, Mountain, Trophy, Crown, Star } from "lucide-react";

interface BadgeIconProps {
  badge: BadgeType;
  size?: 'sm' | 'md' | 'lg';
}

const iconMap = {
  Award,
  Mountain,
  Trophy,
  Crown,
  Star
};

export const BadgeIcon = memo(function BadgeIcon({ badge, size = 'sm' }: BadgeIconProps) {
  const IconComponent = iconMap[badge.icon as keyof typeof iconMap] || Award;
  
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  const badgeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
    lg: "text-sm px-2.5 py-1"
  };

  return (
    <Badge 
      variant="outline" 
      className={`${badgeClasses[size]} flex items-center gap-1`}
      style={{ 
        borderColor: badge.color,
        color: badge.color,
        backgroundColor: `${badge.color}10`
      }}
      title={badge.description}
    >
      <IconComponent className={sizeClasses[size]} />
      <span className="truncate">{badge.name}</span>
    </Badge>
  );
});
