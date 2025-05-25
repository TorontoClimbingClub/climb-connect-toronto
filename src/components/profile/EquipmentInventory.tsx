
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Edit } from "lucide-react";
import { AddEquipmentDialog } from "@/components/gear/AddEquipmentDialog";
import { EditEquipmentDialog } from "@/components/gear/EditEquipmentDialog";

interface UserEquipment {
  id: string;
  item_name: string;
  quantity: number;
  notes: string | null;
  category_id: string;
  equipment_categories: { name: string } | null;
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
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Equipment Inventory ({equipment.length} items)
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
                <div key={item.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{item.item_name}</h4>
                      <span className="text-sm bg-stone-200 px-2 py-1 rounded">
                        {item.equipment_categories?.name || 'Unknown'}
                      </span>
                    </div>
                    <div className="text-sm text-stone-600">
                      Quantity: {item.quantity}
                      {item.notes && <span className="ml-2">• {item.notes}</span>}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditEquipment(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-stone-600">
              <Package className="h-12 w-12 mx-auto mb-3 text-stone-400" />
              <p>No equipment added yet</p>
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
