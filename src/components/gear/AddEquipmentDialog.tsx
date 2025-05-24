
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface EquipmentCategory {
  id: string;
  name: string;
  description: string | null;
}

interface AddEquipmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddEquipmentDialog({ isOpen, onClose, onSuccess }: AddEquipmentDialogProps) {
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [newItem, setNewItem] = useState({
    item_name: "",
    quantity: 1,
    notes: "",
    category_id: "",
  });
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_equipment')
        .insert({
          item_name: newItem.item_name,
          quantity: newItem.quantity,
          notes: newItem.notes || null,
          category_id: newItem.category_id,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Equipment added successfully",
      });

      setNewItem({
        item_name: "",
        quantity: 1,
        notes: "",
        category_id: "",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add equipment",
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
          <DialogTitle>Add New Equipment</DialogTitle>
          <DialogDescription>
            Add a new piece of climbing gear to your inventory
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={newItem.category_id} onValueChange={(value) => setNewItem({...newItem, category_id: value})}>
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
              value={newItem.item_name}
              onChange={(e) => setNewItem({...newItem, item_name: e.target.value})}
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
              value={newItem.quantity}
              onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={newItem.notes}
              onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
              placeholder="Additional details..."
              rows={3}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              {saving ? "Adding..." : "Add Equipment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
