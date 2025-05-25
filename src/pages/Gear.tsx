import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Trash2, Calendar, Edit2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { EditEquipmentDialog } from "@/components/gear/EditEquipmentDialog";

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

export default function Gear() {
  const [equipment, setEquipment] = useState<UserEquipment[]>([]);
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<UserEquipment | null>(null);
  const [newItem, setNewItem] = useState({
    item_name: "",
    quantity: 1,
    notes: "",
    category_id: "",
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchEquipment();
      fetchCategories();
    }
  }, [user]);

  const fetchEquipment = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_equipment')
        .select(`
          *,
          equipment_categories(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch assignment information for each equipment
      const equipmentIds = data?.map(e => e.id) || [];
      const { data: assignmentData } = await supabase
        .from('event_equipment')
        .select(`
          user_equipment_id,
          events(id, title, date)
        `)
        .in('user_equipment_id', equipmentIds);

      const assignmentMap = new Map();
      assignmentData?.forEach(assignment => {
        if (assignment.events) {
          assignmentMap.set(assignment.user_equipment_id, {
            event_id: assignment.events.id,
            event_title: assignment.events.title,
            event_date: assignment.events.date
          });
        }
      });

      const equipmentWithAssignments = data?.map(item => ({
        ...item,
        assignment_info: assignmentMap.get(item.id)
      })) || [];

      setEquipment(equipmentWithAssignments);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast({
        title: "Error",
        description: "Failed to load equipment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const addEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_equipment')
        .insert({
          ...newItem,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Equipment added to your inventory",
      });

      setNewItem({ item_name: "", quantity: 1, notes: "", category_id: "" });
      setShowAddForm(false);
      fetchEquipment();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add equipment",
        variant: "destructive",
      });
    }
  };

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

      fetchEquipment();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove equipment",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Package className="h-12 w-12 text-stone-400 mx-auto mb-4" />
            <p className="text-stone-600 mb-4">Please sign in to manage your gear</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading your gear...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#E55A2B]">My Gear</h1>
            <p className="text-stone-600">Manage your climbing equipment</p>
          </div>
          
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className={`${showAddForm ? 'bg-stone-500 hover:bg-stone-600' : 'bg-[#E55A2B] hover:bg-orange-700'}`}
          >
            {showAddForm ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Gear
              </>
            )}
          </Button>
        </div>

        {/* Inline Add Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add Equipment</CardTitle>
              <CardDescription>
                Add new climbing gear to your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addEquipment} className="space-y-4">
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
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                
                <Button type="submit" className="w-full bg-[#E55A2B] hover:bg-orange-700">
                  Add Equipment
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {equipment.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 text-stone-400 mx-auto mb-4" />
                <p className="text-stone-600 mb-4">No gear in your inventory yet</p>
                <p className="text-sm text-stone-500">Add climbing equipment to track your gear and share it with the community</p>
              </CardContent>
            </Card>
          ) : (
            equipment.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#E55A2B]">{item.item_name}</h3>
                        {item.assignment_info && (
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            Assigned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-stone-600">{item.equipment_categories.name}</p>
                      <p className="text-sm text-stone-500 mt-1">Quantity: {item.quantity}</p>
                      {item.assignment_info && (
                        <p className="text-sm text-orange-600 mt-1">
                          Assigned to: {item.assignment_info.event_title} 
                          <span className="block text-xs">
                            Date: {new Date(item.assignment_info.event_date).toLocaleDateString()}
                          </span>
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-sm text-stone-500 mt-2">{item.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingEquipment(item)}
                        variant="ghost"
                        size="sm"
                        className="text-[#E55A2B] hover:text-orange-700 hover:bg-orange-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => deleteEquipment(item.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={!!item.assignment_info}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {editingEquipment && (
        <EditEquipmentDialog
          equipment={editingEquipment}
          categories={categories}
          isOpen={!!editingEquipment}
          onClose={() => setEditingEquipment(null)}
          onSuccess={fetchEquipment}
        />
      )}

      <Navigation />
    </div>
  );
}
