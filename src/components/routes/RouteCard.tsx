
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ClimbingRoute } from "@/types/routes";

interface RouteCardProps {
  route: ClimbingRoute;
  onClick: () => void;
}

export const RouteCard = ({ route, onClick }: RouteCardProps) => {
  const getStyleColor = (style: string) => {
    switch (style) {
      case 'Trad':
        return 'bg-orange-100 text-orange-800';
      case 'Sport':
        return 'bg-blue-100 text-blue-800';
      case 'Top Rope':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (grade: string) => {
    if (grade.includes('5.1') && (grade.includes('0') || grade.includes('1') || grade.includes('2'))) {
      return 'text-red-600 font-bold';
    }
    if (grade.includes('5.9') || grade.includes('5.10')) {
      return 'text-orange-600 font-semibold';
    }
    if (grade.includes('5.7') || grade.includes('5.8')) {
      return 'text-yellow-600 font-medium';
    }
    return 'text-green-600';
  };

  return (
    <button
      onClick={onClick}
      className="w-full p-3 bg-white rounded-lg hover:shadow-md transition-shadow text-left border border-stone-100"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-stone-800">{route.name}</h3>
        <span className={cn("font-bold", getDifficultyColor(route.grade))}>
          {route.grade}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={getStyleColor(route.style)} variant="secondary">
          {route.style}
        </Badge>
        <span className="text-sm text-stone-500">{route.sector}</span>
      </div>
    </button>
  );
};
