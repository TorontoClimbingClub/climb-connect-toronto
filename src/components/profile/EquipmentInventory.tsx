
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Edit, Trash2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddEquipmentDialog } from "@/components/gear/AddEquipmentDialog";
import { EditEquipmentDialog } from "@/components/gear/EditEquipmentDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserEquipment {
  id: string;
  item_name: string;
  quantity: number;
  notes: string | null;
  category_id: string;
  equipment_categories: { name: string } | null;
  assignment_info?: {
    event_id: string;
    event_title: string;
    event_date: string;
  };
}

interface EquipmentCategory {
  id: string;
  name: string;
  description: string | null;
}

interface EquipmentInventoryProps {
  equipment: UserEquipment[];
  categories: EquipmentCategory[];
  editingEquipment: UserEquipment | null;
  onAddEquipment: (equipment: {
    item_name: string;
    category_id: string;
    quantity: number;
    notes?: string;
  }) => Promise<void>;
  onEditEquipment: (equipment: UserEquipment) => void;
  onCloseEditDialog: () => void;
  onEquipmentSuccess: () => void;
}

export function EquipmentInventory({
  equipment,
  categories,
  editingEquipment,
  onAddEquipment,
  onEditEquipment,
  onCloseEditDialog,
  onEquipmentSuccess,
}: EquipmentInventoryProps) {
  const { toast } = useToast();

  const deleteEquipment = async (id: string) => {
    try {
      // First check if equipment is assigned to any events
      const { data: assignmentData } = await supabase
        .from('event_equipment')
        .select('event_id')
        .eq('user_equipment_id', id);

      if (assignmentData && assignmentData.length > 0) {
        toast({
          title: "Cannot Delete",
          description: "This equipment is assigned to an event. Remove it from the event first.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('user_equipment')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Equipment removed from inventory",
      });

      onEquipmentSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove equipment",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Equipment Inventory
              </CardTitle>
              <CardDescription>Manage your climbing gear collection</CardDescription>
            </div>
            <AddEquipmentDialog 
              categories={categories}
              onAdd={onAddEquipment}
            />
          </div>
        </CardHeader>
        <CardContent>
          {equipment.length > 0 ? (
            <div className="space-y-3">
              {equipment.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-[#E55A2B]">{item.item_name}</h4>
                      <span className="text-sm bg-stone-200 px-2 py-1 rounded">
                        {item.equipment_categories?.name || 'Unknown'}
                      </span>
                      {item.assignment_info && (
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          Assigned
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-stone-600">
                      Quantity: {item.quantity}
                      {item.notes && <span className="ml-2">• {item.notes}</span>}
                    </div>
                    {item.assignment_info && (
                      <p className="text-sm text-orange-600 mt-1">
                        Assigned to: {item.assignment_info.event_title} 
                        <span className="block text-xs">
                          Date: {new Date(item.assignment_info.event_date).toLocaleDateString()}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditEquipment(item)}
                      className="text-[#E55A2B] hover:text-orange-700 hover:bg-orange-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEquipment(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={!!item.assignment_info}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-stone-600">
              <Package className="h-12 w-12 mx-auto mb-3 text-stone-400" />
              <p className="font-medium mb-1">No equipment added yet</p>
              <p className="text-sm">Add your climbing gear to share with the community</p>
            </div>
          )}
        </CardContent>
      </Card>

      {editingEquipment && (
        <EditEquipmentDialog
          equipment={editingEquipment}
          categories={categories}
          isOpen={!!editingEquipment}
          onClose={onCloseEditDialog}
          onSuccess={onEquipmentSuccess}
        />
      )}
    </>
  );
}
