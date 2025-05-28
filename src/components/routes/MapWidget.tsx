
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export function MapWidget() {
  const rattlesnakePointCoords = "43.3945,-79.9637"; // Rattlesnake Point coordinates
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${rattlesnakePointCoords}&zoom=14`;
  
  // Fallback to Google Maps link if no API key
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${rattlesnakePointCoords}`;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-[#E55A2B]" />
          <h3 className="font-semibold text-sm">Rattlesnake Point Location</h3>
        </div>
        
        {/* Simple clickable map preview */}
        <div className="relative">
          <a 
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-6 text-center hover:from-green-200 hover:to-green-300 transition-colors cursor-pointer border border-green-300">
              <MapPin className="h-8 w-8 text-green-700 mx-auto mb-2" />
              <div className="text-sm font-medium text-green-800">
                Rattlesnake Point Conservation Area
              </div>
              <div className="text-xs text-green-600 mt-1">
                Milton, Ontario • Click to view in Google Maps
              </div>
            </div>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
