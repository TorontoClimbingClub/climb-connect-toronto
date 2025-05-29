
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { ClimbingRoute } from "@/types/routes";
import { EditRouteDialog } from "./EditRouteDialog";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";
import { useToast } from "@/hooks/use-toast";

export function RouteManagementTab() {
  const [routes, setRoutes] = useState<ClimbingRoute[]>(rattlesnakeRoutes);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<ClimbingRoute | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditRoute = (route: ClimbingRoute) => {
    console.log('Editing route:', route);
    setSelectedRoute(route);
    setIsEditDialogOpen(true);
  };

  const handleAddRoute = () => {
    setSelectedRoute(null);
    setIsEditDialogOpen(true);
  };

  const handleSaveRoute = (routeData: Partial<ClimbingRoute>) => {
    console.log('Saving route data:', routeData);
    
    if (selectedRoute) {
      // Edit existing route
      setRoutes(prev => {
        const updatedRoutes = prev.map(route => 
          route.id === selectedRoute.id 
            ? { ...route, ...routeData }
            : route
        );
        console.log('Updated routes:', updatedRoutes);
        return updatedRoutes;
      });
      toast({
        title: "Route Updated",
        description: `${routeData.name} has been updated successfully`,
      });
    } else {
      // Add new route
      const newRoute: ClimbingRoute = {
        id: (Math.max(...routes.map(r => parseInt(r.id))) + 1).toString(),
        name: routeData.name!,
        grade: routeData.grade!,
        style: routeData.style!,
        area: routeData.area!,
        sector: routeData.sector!,
      };
      setRoutes(prev => {
        const updatedRoutes = [...prev, newRoute];
        console.log('Added new route:', newRoute);
        return updatedRoutes;
      });
      toast({
        title: "Route Added",
        description: `${routeData.name} has been added successfully`,
      });
    }
    
    setIsEditDialogOpen(false);
    setSelectedRoute(null);
  };

  const handleDeleteRoute = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    if (window.confirm(`Are you sure you want to delete "${route?.name}"? This action cannot be undone.`)) {
      setRoutes(prev => prev.filter(route => route.id !== routeId));
      toast({
        title: "Route Deleted",
        description: `${route?.name} has been deleted`,
      });
    }
  };

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Route Management</CardTitle>
            <Button onClick={handleAddRoute} className="bg-[#E55A2B] hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Route
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search routes by name, grade, area, or sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Showing {filteredRoutes.length} of {routes.length} routes
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredRoutes.map((route) => (
                <div
                  key={route.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {route.name}
                      </h3>
                      <span className="font-bold text-orange-600">
                        {route.grade}
                      </span>
                      <Badge className={getStyleColor(route.style)} variant="secondary">
                        {route.style}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {route.area} • {route.sector}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditRoute(route)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRoute(route.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <EditRouteDialog
        route={selectedRoute}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveRoute}
      />
    </div>
  );
}
