
import { ArrowLeft, MapPin } from "lucide-react";

interface RouteHeaderProps {
  routeName: string;
  area: string;
  sector: string;
  onBack: () => void;
}

export function RouteHeader({ routeName, area, sector, onBack }: RouteHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button 
        onClick={onBack}
        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
      >
        <ArrowLeft className="h-5 w-5 text-[#E55A2B]" />
      </button>
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-[#E55A2B]">{routeName}</h1>
        <div className="flex items-center gap-2 text-stone-600">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{area}, {sector}</span>
        </div>
      </div>
    </div>
  );
}
