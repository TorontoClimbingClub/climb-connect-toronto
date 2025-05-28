
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Mountain, ChevronRight } from "lucide-react";

interface SectorCardProps {
  name: string;
  routeCount: number;
  onClick: () => void;
}

export const SectorCard = ({ name, routeCount, onClick }: SectorCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Mountain className="h-6 w-6 text-[#E55A2B]" />
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <p className="text-stone-600 text-sm">{routeCount} routes</p>
          </div>
          <ChevronRight className="h-5 w-5 text-stone-400 ml-auto" />
        </div>
      </CardHeader>
    </Card>
  );
};
