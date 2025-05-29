
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export function MapWidget() {
  const rattlesnakePointCoords = "43.47135608967603,-79.91267423906265";
  
  // Use Google Maps link with the exact coordinates
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${rattlesnakePointCoords}`;

  return (
    <Card className="mb-4">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-[#E55A2B]" />
          <h3 className="font-semibold text-sm">Rattlesnake Point Location</h3>
        </div>
        
        {/* Clickable map preview */}
        <div className="relative">
          <a 
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-3 text-center hover:from-green-200 hover:to-green-300 transition-colors cursor-pointer border border-green-300">
              <MapPin className="h-5 w-5 text-green-700 mx-auto mb-1" />
              <div className="text-xs font-medium text-green-800">
                Rattlesnake Point Conservation Area
              </div>
              <div className="text-xs text-green-600 mt-1">
                Milton, Ontario • Click to view in Google Maps
              </div>
              <div className="text-xs text-green-500 mt-1">
                {rattlesnakePointCoords}
              </div>
            </div>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
