
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Plus, X } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useEquipmentManagement } from "@/hooks/useEquipmentManagement";
import { useToast } from "@/hooks/use-toast";

interface Equipment {
  id: string;
  item_name: string;
  quantity: number;
  notes: string | null;
  user_id: string;
  owner_name: string;
  category_name: string;
}

interface UserEquipment {
  id: string;
  item_name: string;
  quantity: number;
  notes: string | null;
  category_name: string;
  is_assigned?: boolean;
  assigned_event?: string;
}

interface EquipmentCardProps {
  equipment: Equipment[];
  userEquipment: UserEquipment[];
  currentUserId?: string;
  eventId: string;
  onRefresh: () => void;
}

export function EquipmentCard({ 
  equipment, 
  userEquipment, 
  currentUserId, 
  eventId, 
  onRefresh 
}: EquipmentCardProps) {
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const { addEquipmentToEvent, removeUserEquipmentFromEvent, loading } = useEquipmentManagement();
  const { toast } = useToast();

  // Check if current user is participating in the event
  const isUserParticipating = equipment.some(item => item.user_id === currentUserId);

  const handleAddEquipment = async () => {
    if (!currentUserId) return;
    
    if (selectedEquipment.length === 0) {
      toast({
        title: "No equipment selected",
        description: "Please select equipment to add to the event",
        variant: "destructive",
      });
      return;
    }

    const result = await addEquipmentToEvent(selectedEquipment, eventId, currentUserId);
    if (result.success) {
      setSelectedEquipment([]);
      setShowAddEquipment(false);
      onRefresh();
    }
  };

  const handleRemoveAllUserEquipment = async () => {
    if (!currentUserId) return;
    
    const result = await removeUserEquipmentFromEvent(currentUserId, eventId);
    if (result.success) {
      onRefresh();
    }
  };

  const availableEquipment = userEquipment.filter(item => 
    !item.is_assigned || item.assigned_event === eventId
  );

  const userEventEquipment = equipment.filter(item => item.user_id === currentUserId);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Shared Equipment
          </CardTitle>
          {currentUserId && isUserParticipating && (
            <div className="flex gap-2">
              {userEventEquipment.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveAllUserEquipment}
                  disabled={loading}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove My Equipment
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddEquipment(!showAddEquipment)}
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </div>
          )}
          {currentUserId && !isUserParticipating && (
            <Badge variant="secondary" className="text-xs">
              Join event to share equipment
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Equipment Section */}
        {showAddEquipment && currentUserId && isUserParticipating && (
          <div className="p-4 bg-orange-50 rounded-lg border">
            <h4 className="font-medium mb-3">Select equipment to share:</h4>
            {availableEquipment.length > 0 ? (
              <div className="space-y-2">
                {availableEquipment.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={selectedEquipment.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedEquipment([...selectedEquipment, item.id]);
                        } else {
                          setSelectedEquipment(selectedEquipment.filter(id => id !== item.id));
                        }
                      }}
                    />
                    <label htmlFor={item.id} className="text-sm flex-1 cursor-pointer">
                      {item.item_name} (×{item.quantity}) - {item.category_name}
                      {item.notes && <span className="text-stone-500"> • {item.notes}</span>}
                    </label>
                  </div>
                ))}
                <div className="flex gap-2 mt-3">
                  <Button onClick={handleAddEquipment} size="sm" disabled={loading}>
                    Add Selected
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowAddEquipment(false);
                      setSelectedEquipment([]);
                    }} 
                    variant="outline" 
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-stone-600">No equipment available to share</p>
            )}
          </div>
        )}

        {/* Equipment List */}
        {equipment.length > 0 ? (
          <div className="space-y-3">
            {equipment.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-[#E55A2B]">{item.item_name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {item.category_name}
                    </Badge>
                  </div>
                  <p className="text-sm text-stone-600">
                    Shared by: {item.owner_name} • Quantity: {item.quantity}
                    {item.notes && ` • ${item.notes}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-stone-600">
            <Package className="h-12 w-12 mx-auto mb-3 text-stone-400" />
            <p className="font-medium mb-1">No equipment shared yet</p>
            <p className="text-sm">Join the event and add your gear to share with others</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
