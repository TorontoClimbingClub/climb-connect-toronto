
export interface UserEquipment {
  id: string;
  item_name: string;
  quantity: number;
  notes: string | null;
  category_id: string;
  category_name?: string;
  is_assigned?: boolean;
  assigned_event?: string;
}

export interface EquipmentCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}
