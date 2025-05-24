
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EquipmentCategory {
  id: string;
  name: string;
  description: string | null;
}

interface UserEquipment {
  id: string;
  item_name: string;
  quantity: number;
  notes: string | null;
  category_id: string;
  equipment_categories: {
    name: string;
  };
  assignment_info?: {
    event_id: string;
    event_title: string;
    event_date: string;
  };
}

interface EditEquipmentDialogProps {
  equipment: UserEquipment;
  categories: EquipmentCategory[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditEquipmentDialog({
  equipment,
  categories,
  isOpen,
  onClose,
  onSuccess
}: EditEquipmentDialogProps) {
  const [editItem, setEditItem] = useState({
    item_name: equipment.item_name,
    quantity: equipment.quantity,
    notes: equipment.notes || "",
    category_id: equipment.category_id,
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('user_equipment')
        .update({
          item_name: editItem.item_name,
          quantity: editItem.quantity,
          notes: editItem.notes || null,
          category_id: editItem.category_id,
        })
        .eq('id', equipment.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Equipment updated successfully",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update equipment",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 top-4 translate-y-0 data-[state=open]:slide-in-from-top-4">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
          <DialogDescription>
            Update your climbing gear details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={editItem.category_id} onValueChange={(value) => setEditItem({...editItem, category_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="item_name">Item Name</Label>
            <Input
              id="item_name"
              value={editItem.item_name}
              onChange={(e) => setEditItem({...editItem, item_name: e.target.value})}
              placeholder="e.g., Dynamic Rope 70m"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={editItem.quantity}
              onChange={(e) => setEditItem({...editItem, quantity: parseInt(e.target.value) || 1})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={editItem.notes}
              onChange={(e) => setEditItem({...editItem, notes: e.target.value})}
              placeholder="Additional details..."
              rows={3}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
