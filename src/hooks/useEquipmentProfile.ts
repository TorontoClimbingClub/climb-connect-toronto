
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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

export function useEquipmentProfile() {
  const [equipment, setEquipment] = useState<UserEquipment[]>([]);
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [editingEquipment, setEditingEquipment] = useState<UserEquipment | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchEquipment();
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment_categories')
        .select('id, name, description')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchEquipment = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_equipment')
        .select(`
          id,
          item_name,
          quantity,
          notes,
          category_id,
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
    }
  };

  const addEquipment = async (equipment: {
    item_name: string;
    category_id: string;
    quantity: number;
    notes?: string;
  }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_equipment')
        .insert({
          ...equipment,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Equipment added successfully",
      });

      fetchEquipment();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add equipment",
        variant: "destructive",
      });
    }
  };

  const deleteEquipment = async (equipmentId: string) => {
    try {
      const { error } = await supabase
        .from('user_equipment')
        .delete()
        .eq('id', equipmentId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Equipment deleted successfully",
      });

      fetchEquipment();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete equipment",
        variant: "destructive",
      });
    }
  };

  return {
    equipment,
    categories,
    editingEquipment,
    setEditingEquipment,
    addEquipment,
    deleteEquipment,
    fetchEquipment,
  };
}
