
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ChevronRight } from "lucide-react";

interface CragCardProps {
  name: string;
  location: string;
  onClick: () => void;
}

export const CragCard = ({ name, location, onClick }: CragCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <MapPin className="h-6 w-6 text-[#E55A2B]" />
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <p className="text-stone-600 text-sm">{location}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-stone-400 ml-auto" />
        </div>
      </CardHeader>
    </Card>
  );
};
