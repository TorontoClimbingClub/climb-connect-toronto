
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export function MapWidget() {
  const rattlesnakePointCoords = "43.47134738744105,-79.91270091664332";
  
  // Use Google Maps link with the exact coordinates
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${rattlesnakePointCoords}`;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-[#E55A2B]" />
          <h3 className="font-semibold text-sm">Rattlesnake Point Location</h3>
        </div>
        
        {/* Clickable map preview */}
        <div className="relative">
          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-4 text-center border border-green-300">
            <MapPin className="h-6 w-6 text-green-700 mx-auto mb-2" />
            <div className="text-sm font-medium text-green-800 mb-2">
              Rattlesnake Point Conservation Area
            </div>
            <div className="text-xs text-green-600 mb-3">
              Milton, Ontario
            </div>
            <div className="text-xs text-green-500 mb-3">
              43.471347, -79.912701
            </div>
            <a 
              href={googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded transition-colors"
            >
              View in Maps
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
